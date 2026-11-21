const express = require('express');
const path = require('path');

function createApp() {
  const app = express();
  const rootDir = __dirname;

  app.disable('x-powered-by');

  app.use('/assets/aistudio', express.static(path.join(rootDir, 'public', 'assets', 'aistudio')));
  app.use('/assets', express.static(path.join(rootDir, 'assets')));

  app.get(['/', '/index.html'], (_req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
  });

  app.get('/style.css', (_req, res) => {
    res.sendFile(path.join(rootDir, 'style.css'));
  });

  app.get('/filterblade.js', (_req, res) => {
    res.sendFile(path.join(rootDir, 'filterblade.js'));
  });

  app.get('/game.js', (_req, res) => {
    res.sendFile(path.join(rootDir, 'game.js'));
  });

  return app;
}

if (require.main === module) {
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = '0.0.0.0';
  const app = createApp();

  app.listen(PORT, HOST, () => {
    console.log(`Divine Clicker server listening on http://${HOST}:${PORT}`);
  });
}

module.exports = { createApp };
