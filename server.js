const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3889;

// Configurar Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 256 * 1024 * 1024 } // 256MB
}).array('files');

// Servir archivos estáticos
app.use('/uploads', express.static('uploads'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejar subidas
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        
        const urls = req.files.map(file => {
            return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        });
        
        res.json({ urls });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
