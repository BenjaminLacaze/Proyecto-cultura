const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pointsFilePath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'points.json');

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
