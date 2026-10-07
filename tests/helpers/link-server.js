'use strict';

const http = require('node:http');

/** A tiny local web server with one path per behaviour a link checker has to handle. */
async function startLinkServer() {
  const counts = new Map();

  const server = http.createServer((req, res) => {
    const count = (counts.get(req.url) || 0) + 1;
    counts.set(req.url, count);

    const send = (status, headers = {}) => {
      res.writeHead(status, headers);
      res.end();
    };
    const isHead = req.method === 'HEAD';

    switch (req.url) {
      case '/ok':
      case '/ok2':
        return send(200);
      case '/moved':
        return send(301, { location: '/ok' });
      case '/head-405':
        return send(isHead ? 405 : 200);
      case '/head-404':
        return send(isHead ? 404 : 200);
      case '/flaky':
        return send(count <= 2 ? 503 : 200);
      case '/always-503':
        return send(503);
      case '/rate':
        return send(429);
      case '/forbidden':
        return send(403);
      case '/slow':
        return undefined; // never answers
      default:
        return send(404);
    }
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  return {
    url: `http://127.0.0.1:${port}`,
    hits: (path) => counts.get(path) || 0,
    close() {
      server.closeAllConnections();
      return new Promise((resolve) => server.close(resolve));
    },
  };
}

module.exports = { startLinkServer };