const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { createApp } = require('./server');

function requestPath(port, urlPath) {
  return new Promise((resolve, reject) => {
    http
      .get({ hostname: '127.0.0.1', port, path: urlPath }, (res) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          resolve({ statusCode: res.statusCode, headers: res.headers, body });
        });
      })
      .on('error', reject);
  });
}

test('static server serves index, scripts, styles, and assets while blocking server files', async () => {
  const app = createApp();
  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });

  try {
    const { port } = server.address();

    const home = await requestPath(port, '/');
    assert.equal(home.statusCode, 200);
    assert.match(home.body, /<title>Divine Clicker<\/title>/);

    const css = await requestPath(port, '/style.css?v=23');
    assert.equal(css.statusCode, 200);
    assert.match(css.headers['content-type'] || '', /text\/css/);

    const fb = await requestPath(port, '/filterblade.js?v=25');
    assert.equal(fb.statusCode, 200);
    assert.match(fb.headers['content-type'] || '', /javascript/);

    const js = await requestPath(port, '/game.js?v=23');
    assert.equal(js.statusCode, 200);
    assert.match(js.headers['content-type'] || '', /javascript/);

    const asset = await requestPath(port, '/assets/icons/currency/divine_orb.webp?v=27');
    assert.equal(asset.statusCode, 200);

    const abyssAsset = await requestPath(port, '/assets/icons/abyss.webp?v=27');
    assert.equal(abyssAsset.statusCode, 200);

    const removedGen = await requestPath(port, '/assets/icons/divine_orb.jpg');
    assert.equal(removedGen.statusCode, 404);

    for (const uiPath of [
      '/assets/ui/atlas_bg_poe2.jpg',
      '/assets/ui/bottom_dock_poe2.jpg',
      '/assets/ui/scroll_banner_poe2.jpg',
      '/assets/ui/modal_frame_poe2.jpg',
      '/assets/ui/modal_panels_poe2.jpg',
      '/assets/ui/modal_controls_poe2.jpg'
    ]) {
      const uiRes = await requestPath(port, uiPath);
      assert.equal(uiRes.statusCode, 200);
    }

    for (const audioPath of [
      '/assets/aistudio/S-S___57e3b2ee.mp3',
      '/assets/aistudio/A__b835de96.mp3',
      '/assets/aistudio/A-B_7c0c8a02.mp3'
    ]) {
      const audioRes = await requestPath(port, audioPath);
      assert.equal(audioRes.statusCode, 200);
    }

    const blockedServer = await requestPath(port, '/server.js');
    assert.equal(blockedServer.statusCode, 404);

    const blockedPkg = await requestPath(port, '/package.json');
    assert.equal(blockedPkg.statusCode, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
