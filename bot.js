const express = require('express');
const cors = require('cors');
const { search, ytmp3, ytmp4, ytdlv2, channel } = require('@vreden/youtube_scraper');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de búsqueda
app.get('/search', (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: 'Parámetro query requerido' });

    search(query)
        .then(result => {
            result.status 
                ? res.json(result.results)
                : res.status(500).json({ error: result.result });
        })
        .catch(error => res.status(500).json({ error: error.message }));
});

// Ruta para obtener información de canal
app.get('/channel', (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: 'Parámetro query requerido' });

    channel(query)
        .then(result => {
            result.status 
                ? res.json(result.results)
                : res.status(500).json({ error: result.result });
        })
        .catch(error => res.status(500).json({ error: error.message }));
});

// Ruta para descargar MP3
app.get('/ytmp3', (req, res) => {
    const url = req.query.url;
    const quality = req.query.quality || '128';
    
    if (!url) return res.status(400).json({ error: 'Parámetro URL requerido' });

    ytmp3(url, quality)
        .then(result => {
            result.status 
                ? res.json(result)
                : res.status(500).json({ error: result.result });
        })
        .catch(error => res.status(500).json({ error: error.message }));
});

// Ruta para descargar MP4
app.get('/ytmp4', (req, res) => {
    const url = req.query.url;
    const quality = req.query.quality || '360';
    
    if (!url) return res.status(400).json({ error: 'Parámetro URL requerido' });

    ytmp4(url, quality)
        .then(result => {
            result.status 
                ? res.json(result)
                : res.status(500).json({ error: result.result });
        })
        .catch(error => res.status(500).json({ error: error.message }));
});

// Ruta para ytdlv2 (versión avanzada)
app.get('/ytdlv2', (req, res) => {
    const url = req.query.url;
    const quality = req.query.quality;
    
    if (!url) return res.status(400).json({ error: 'Parámetro URL requerido' });

    ytdlv2(url, quality)
        .then(result => {
            result.status 
                ? res.json(result)
                : res.status(500).json({ error: result.result });
        })
        .catch(error => res.status(500).json({ error: error.message }));
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`API corriendo en http://localhost:${port}`);
});
