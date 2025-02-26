const express = require('express');
const scraper = require('@danitech/scraper');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Manejar CORS (opcional)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Descargar video de YouTube
app.get('/download/youtube', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL parameter is required' });

    const response = await scraper.downloader.youtube_video(url);
    if (!response.ok) throw new Error('Failed to fetch video data');
    
    const data = await response.json();
    if (!data.data) return res.status(404).json({ status: 'Error', code: 404, message: 'Data not found!' });

    res.json({
      status: 'Success',
      code: 200,
      author: 'Dani Techno.',
      data: data.data
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar letras de canciones
app.get('/search/lyrics', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query parameter is required' });

    const response = await scraper.searcher.lyrics(query);
    if (!response.ok) throw new Error('Failed to fetch lyrics');
    
    const data = await response.json();
    res.json({
      status: 'Success',
      code: 200,
      author: 'Dani Techno.',
      data: data.data
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener imagen random de waifu (SFW)
app.get('/anime/sfw/waifu', async (req, res) => {
  try {
    const response = await scraper.random_image_anime_sfw.waifu();
    if (!response.ok) throw new Error('Failed to fetch image');
    
    const data = await response.json();
    res.json({
      status: 'Success',
      code: 200,
      author: 'Dani Techno.',
      data: data.data
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Herramientas: Codificar Base64
app.get('/tools/base64/encode', (req, res) => {
  try {
    const { text } = req.query;
    if (!text) return res.status(400).json({ error: 'Text parameter is required' });

    const encoded = scraper.tools.base64_encode(text);
    res.json({
      status: 'Success',
      code: 200,
      author: 'Dani Techno.',
      data: encoded
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Herramientas: Decodificar Base64
app.get('/tools/base64/decode', (req, res) => {
  try {
    const { text } = req.query;
    if (!text) return res.status(400).json({ error: 'Text parameter is required' });

    const decoded = scraper.tools.base64_decode(text);
    res.json({
      status: 'Success',
      code: 200,
      author: 'Dani Techno.',
      data: decoded
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
