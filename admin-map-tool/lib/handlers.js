// Lógica de la API del admin, compartida entre el servidor local (server.js)
// y las funciones de Vercel (carpeta api/).
const crypto = require('crypto');
const path = require('path');
const storage = require('./storage');

const ok = (body) => ({ status: 200, body });
const fail = (status, error) => ({ status, body: { error } });

function checkAuth(headers) {
    const pw = process.env.ADMIN_PASSWORD;
    if (!pw) return !storage.isRemote(); // en modo publicado la contraseña es obligatoria
    const given = Buffer.from(String(headers['x-admin-password'] || ''));
    const expected = Buffer.from(pw);
    return given.length === expected.length && crypto.timingSafeEqual(given, expected);
}

function cleanPoint(input) {
    const p = input || {};
    const lat = Number(p.position && p.position[0]);
    const lng = Number(p.position && p.position[1]);
    if (!String(p.title || '').trim()) return { error: 'El título es obligatorio' };
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return { error: 'Coordenadas no válidas' };
    return {
        point: {
            title: String(p.title).trim(),
            category: String(p.category || '').trim(),
            section: String(p.section || 'encuentro'),
            image: String(p.image || '').trim(),
            position: [lat, lng],
            screens: Array.isArray(p.screens)
                ? p.screens.map((s) => ({ image: String((s && s.image) || '').trim(), text: String((s && s.text) || '') }))
                : [],
        },
    };
}

const routes = {
    async config() {
        return ok({
            mode: storage.isRemote() ? 'remote' : 'local',
            authRequired: !!process.env.ADMIN_PASSWORD || storage.isRemote(),
            assetBase: storage.assetBase(),
        });
    },

    async login({ method, headers }) {
        if (method !== 'POST') return fail(405, 'Método no permitido');
        if (storage.isRemote() && !process.env.ADMIN_PASSWORD) {
            return fail(500, 'Falta configurar ADMIN_PASSWORD en Vercel');
        }
        return checkAuth(headers) ? ok({ ok: true }) : fail(401, 'Contraseña incorrecta');
    },

    async points({ method, body }) {
        if (method === 'GET') return ok(await storage.readPoints());
        if (method !== 'POST') return fail(405, 'Método no permitido');
        const { point, error } = cleanPoint(body);
        if (error) return fail(400, error);
        const saved = await storage.updatePoints((points) => {
            const id = points.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;
            const newPoint = { ...point, id };
            return { points: [...points, newPoint], result: newPoint, message: `admin: agrega punto "${point.title}"` };
        });
        return ok({ message: 'Punto guardado exitosamente', point: saved });
    },

    async pointById({ method, params, body }) {
        const id = parseInt(params.id, 10);
        if (!Number.isFinite(id)) return fail(400, 'ID no válido');

        if (method === 'PUT') {
            const { point, error } = cleanPoint(body);
            if (error) return fail(400, error);
            let found = false;
            const saved = await storage.updatePoints((points) => {
                const updated = { ...point, id };
                found = points.some((p) => p.id === id);
                return {
                    points: points.map((p) => (p.id === id ? updated : p)),
                    result: updated,
                    message: `admin: edita punto "${point.title}"`,
                };
            });
            if (!found) return fail(404, 'Punto no encontrado');
            return ok({ message: 'Punto actualizado', point: saved });
        }

        if (method === 'DELETE') {
            await storage.updatePoints((points) => {
                const target = points.find((p) => p.id === id);
                return {
                    points: points.filter((p) => p.id !== id),
                    result: null,
                    message: `admin: elimina punto "${target ? target.title : id}"`,
                };
            });
            return ok({ message: 'Punto eliminado' });
        }

        return fail(405, 'Método no permitido');
    },

    async upload({ method, body }) {
        if (method !== 'POST') return fail(405, 'Método no permitido');
        const { filename, data } = body || {};
        const match = /^data:(image\/(png|jpe?g|gif|webp|avif));base64,(.+)$/.exec(data || '');
        if (!match) return fail(400, 'Formato de imagen no válido');
        const ext = match[2] === 'jpeg' ? 'jpg' : match[2];
        const base = path.parse(filename || 'foto').name
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 40) || 'foto';
        const url = await storage.saveImage(`${Date.now()}-${base}.${ext}`, Buffer.from(match[3], 'base64'));
        return ok({ url });
    },
};

const PUBLIC_ROUTES = new Set(['config', 'login']);

async function dispatch(route, req) {
    try {
        if (!PUBLIC_ROUTES.has(route) && !checkAuth(req.headers || {})) {
            return fail(401, 'No autorizado');
        }
        return await routes[route]({ params: {}, ...req });
    } catch (e) {
        console.error(`[admin] Error en ${route}:`, e);
        return fail(500, e.message || 'Error interno');
    }
}

// Adaptador para funciones de Vercel: module.exports = vercelHandler('points')
function vercelHandler(route) {
    return async (req, res) => {
        const r = await dispatch(route, {
            method: req.method,
            params: req.query || {},
            body: req.body,
            headers: req.headers,
        });
        res.setHeader('Cache-Control', 'no-store');
        res.status(r.status).json(r.body);
    };
}

module.exports = { dispatch, vercelHandler };
