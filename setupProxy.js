const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/auth',
    createProxyMiddleware({
      target: 'http://localhost:5263/',
      changeOrigin: true,
      credentials: true,
    })
  );

  app.use(
    '/users',
    createProxyMiddleware({
      target: 'http://localhost:5263/',
      changeOrigin: true,
      credentials: true,
    })
  );

  app.use(
    '/balance',
    createProxyMiddleware({
      target: 'http://localhost:5263/',
      changeOrigin: true,
      credentials: true,
    })
  );

  app.use(
    '/expense',
    createProxyMiddleware({
      target: 'http://localhost:5263/',
      changeOrigin: true,
      credentials: true,
    })
  );

  app.use(
    '/friendship',
    createProxyMiddleware({
      target: 'http://localhost:5263/',
      changeOrigin: true,
      credentials: true,
    })
  );
};