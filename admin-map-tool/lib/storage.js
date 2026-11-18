// Capa de almacenamiento del admin.
// - Modo LOCAL (sin GITHUB_TOKEN): lee/escribe los archivos del frontend en disco, como siempre.
// - Modo PUBLICADO (con GITHUB_TOKEN, ej. en Vercel): lee/escribe esos mismos archivos en el
//   repositorio de GitHub haciendo commits. Vercel detecta el commit y vuelve a publicar el mapa.
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..', '..');
const POINTS_REL = 'frontend/src/data/points.json';
const AGENDA_REL = 'frontend/src/data/agenda.json';
const CONTACT_REL = 'frontend/src/data/contact.json';
const UPLOADS_REL = 'frontend/public/uploads';

const cfg = () => ({
    token: process.env.GITHUB_TOKEN,
    repo: process.env.GITHUB_REPO || 'BenjaminLacaze/Proyecto-cultura',
    branch: process.env.GITHUB_BRANCH || 'main',
});

const isRemote = () => !!process.env.GITHUB_TOKEN;

// URL base para previsualizar en el admin las fotos guardadas en /uploads
function assetBase() {
    if (!isRemote()) return '';
    const { repo, branch } = cfg();
    return `https://raw.githubusercontent.com/${repo}/${branch}/frontend/public`;
}

// ---------- GitHub ----------
async function gh(method, apiPath, body) {
    const { token } = cfg();
    const res = await fetch(`https://api.github.com${apiPath}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'admin-map-tool',
            ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const err = new Error(`GitHub ${res.status}: ${data.message || 'error desconocido'}`);
        err.status = res.status;
        throw err;
    }
    return data;
}

const contentsUrl = (rel) => `/repos/${cfg().repo}/contents/${rel.split('/').map(encodeURIComponent).join('/')}`;

async function readRemoteFile(rel) {
    try {
        const data = await gh('GET', `${contentsUrl(rel)}?ref=${encodeURIComponent(cfg().branch)}`);
        let buf;
        if (data.content && data.encoding === 'base64') {
            buf = Buffer.from(data.content, 'base64');
        } else {
            // Archivos > 1 MB: se leen a través de la API de blobs
            const blob = await gh('GET', `/repos/${cfg().repo}/git/blobs/${data.sha}`);
            buf = Buffer.from(blob.content, 'base64');
        }
        return { text: buf.toString('utf8'), sha: data.sha };
    } catch (e) {
        if (e.status === 404) return { text: null, sha: null };
        throw e;
    }
}

async function writeRemoteFile(rel, buffer, sha, message) {
    await gh('PUT', contentsUrl(rel), {
        message,
        content: buffer.toString('base64'),
        branch: cfg().branch,
        ...(sha ? { sha } : {}),
    });
}

// ---------- Helper genérico para archivos JSON ----------
function parseJson(text, fallback = null) {
    if (!text) return fallback;
    try {
        return JSON.parse(text);
    } catch {
        return fallback;
    }
}

async function loadJsonFile(rel, fallback = null) {
    if (isRemote()) {
        const { text, sha } = await readRemoteFile(rel);
        return { data: parseJson(text, fallback), sha };
    }
    const file = path.join(REPO_ROOT, rel);
    const text = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
    return { data: parseJson(text, fallback), sha: null };
}

async function updateJsonFile(rel, mutate, fallback = null) {
    for (let attempt = 0; ; attempt++) {
        const { data, sha } = await loadJsonFile(rel, fallback);
        const { next, result, message } = mutate(data);
        const json = JSON.stringify(next, null, 2);
        if (!isRemote()) {
            const file = path.join(REPO_ROOT, rel);
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, json, 'utf8');
            return result;
        }
        try {
            await writeRemoteFile(rel, Buffer.from(json, 'utf8'), sha, message);
            return result;
        } catch (e) {
            if ((e.status === 409 || e.status === 422) && attempt < 3) continue;
            throw e;
        }
    }
}

// ---------- Puntos ----------
async function readPoints() {
    const { data } = await loadJsonFile(POINTS_REL, []);
    return Array.isArray(data) ? data : [];
}

async function updatePoints(mutate) {
    return updateJsonFile(POINTS_REL, (points) => {
        const arr = Array.isArray(points) ? points : [];
        const { points: next, result, message } = mutate(arr);
        return { next, result, message };
    }, []);
}

// ---------- Agenda ----------
async function readAgenda() {
    const { data } = await loadJsonFile(AGENDA_REL, {});
    return data || {};
}

async function updateAgenda(newAgenda) {
    return updateJsonFile(AGENDA_REL, () => ({
        next: newAgenda,
        result: newAgenda,
        message: 'admin: actualiza agenda cultural'
    }), {});
}

// ---------- Contacto ----------
async function readContact() {
    const { data } = await loadJsonFile(CONTACT_REL, {});
    return data || {};
}

async function updateContact(newContact) {
    return updateJsonFile(CONTACT_REL, () => ({
        next: newContact,
        result: newContact,
        message: 'admin: actualiza datos de contacto'
    }), {});
}

// ---------- Imágenes ----------
async function saveImage(fileName, buffer) {
    if (isRemote()) {
        await writeRemoteFile(`${UPLOADS_REL}/${fileName}`, buffer, null, `admin: sube foto ${fileName}`);
    } else {
        const dir = path.join(REPO_ROOT, UPLOADS_REL);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, fileName), buffer);
    }
    return `/uploads/${fileName}`;
}

module.exports = {
    isRemote,
    assetBase,
    readPoints,
    updatePoints,
    readAgenda,
    updateAgenda,
    readContact,
    updateContact,
    saveImage,
    UPLOADS_DIR: path.join(REPO_ROOT, UPLOADS_REL),
};
