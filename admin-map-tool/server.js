const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const pointsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'points.json');
const uploadsDir = path.join(__dirname, '..', 'frontend', 'public', 'uploads');

// Servir las imágenes subidas también desde el admin (para previsualizar)
app.use('/uploads', express.static(uploadsDir));

// POST para subir una foto desde la computadora (base64)
app.post('/api/upload', (req, res) => {
    const { filename, data } = req.body || {};
    const match = /^data:(image\/(png|jpe?g|gif|webp|avif));base64,(.+)$/.exec(data || '');
    if (!match) return res.status(400).json({ error: 'Formato de imagen no válido' });

    const ext = match[2] === 'jpeg' ? 'jpg' : match[2];
    const base = path.parse(filename || 'foto').name
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 40) || 'foto';
    const finalName = `${Date.now()}-${base}.${ext}`;

    fs.mkdirSync(uploadsDir, { recursive: true });
    fs.writeFile(path.join(uploadsDir, finalName), Buffer.from(match[3], 'base64'), (err) => {
        if (err) {
            console.error('Error guardando imagen', err);
            return res.status(500).json({ error: 'No se pudo guardar la imagen' });
        }
        res.json({ url: `/uploads/${finalName}` });
    });
});

// GET all points
app.get('/api/points', (req, res) => {
    fs.readFile(pointsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading points.json', err);
            // Si el archivo no existe, devolver arreglo vacío
            return res.json([]);
        }
        try {
            res.json(JSON.parse(data));
        } catch (e) {
            res.json([]);
        }
    });
});

// POST to add a new point
app.post('/api/points', (req, res) => {
    const newPoint = req.body;
    
    fs.readFile(pointsFilePath, 'utf8', (err, data) => {
        let points = [];
        if (!err) {
            try {
                points = JSON.parse(data);
            } catch(e) {}
        }
        
        // Asignar ID
        const maxId = points.reduce((max, p) => Math.max(max, p.id), 0);
        newPoint.id = maxId + 1;
        
        points.push(newPoint);
        
        fs.writeFile(pointsFilePath, JSON.stringify(points, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error saving points', err);
                return res.status(500).json({ error: 'Failed to save point' });
            }
            res.json({ message: 'Punto guardado exitosamente', point: newPoint });
        });
    });
});

// DELETE a point by id
app.delete('/api/points/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    fs.readFile(pointsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read points' });
        let points = JSON.parse(data);
        points = points.filter(p => p.id !== id);
        
        fs.writeFile(pointsFilePath, JSON.stringify(points, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ error: 'Failed to delete point' });
            res.json({ message: 'Punto eliminado' });
        });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Administrador de Puntos en ejecución en http://localhost:${PORT}`);
});
