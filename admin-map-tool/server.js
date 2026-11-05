const express = require('express');
const cors = require('cors');
const path = require('path');
const { dispatch } = require('./lib/handlers');
const storage = require('./lib/storage');

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Servir las imágenes subidas también desde el admin (para previsualizar en modo local)
app.use('/uploads', express.static(storage.UPLOADS_DIR));

// Misma API que las funciones de Vercel (carpeta api/)
const adapt = (route) => async (req, res) => {
    const r = await dispatch(route, { method: req.method, params: req.params, body: req.body, headers: req.headers });
    res.status(r.status).json(r.body);
};

app.all('/api/config', adapt('config'));
app.all('/api/login', adapt('login'));
app.all('/api/points', adapt('points'));
app.all('/api/points/:id', adapt('pointById'));
app.all('/api/upload', adapt('upload'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    const modo = storage.isRemote() ? 'PUBLICADO (guarda en GitHub)' : 'LOCAL (guarda en disco)';
    console.log(`Administrador de Puntos en ejecución en http://localhost:${PORT} — modo ${modo}`);
});
