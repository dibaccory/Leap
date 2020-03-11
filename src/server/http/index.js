import http from 'http';
import path from 'path';
import express from 'express';
import { Provider } from 'react-redux';
import React from 'react';
//import { RouterContext, match } from 'react-router';
import { renderToString } from 'react-dom/server'
import configureStore from '../../common/store';
import { SocketConnection } from '../../common/middleware/socket';
import App from '../../common/containers/App';


const getUrl = server => `http://${server.address().address}:${server.address().port}`;
const bindCtx = (ctx) => (req, res, next) => {
  req.ctx = ctx;
  next();
};

function renderFullPage(html, initialState) {
  return `
    <!doctype html>
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" />
        <link rel="icon" href="./favicon.ico" type="image/x-icon" />
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <title>Leap</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
        </script>
        <script src="/dist/bundle.js"></script>
      </body>
    </html>
  `
}

const init = ctx => {
  const { config } = ctx;
  console.log('config: ', config)
  const { port, host } = config;
  const app = express();
  const router = express.Router();
  app.use(router);
  app.use('/', express.static(path.join(__dirname, '../..', 'public')));
  app.get('/*', (req, res) => {

    const store = configureStore();
    const InitialView = (
    <Provider store={store}>
      <SocketConnection>
        <App key={0}/>
      </SocketConnection>
    </Provider>);

    const initialState = (process.NODE_ENV === 'production')
    ? store.getState()
    : {};

    const html = renderToString(InitialView);
    res.status(200).end(renderFullPage(html, initialState));

  });

  const httpServer = http.createServer(app);
  const promise = new Promise( resolve => {
    app.use(bindCtx(ctx));
    httpServer.listen(port, host, () => {
        console.log('httpServer: ', httpServer.address())
        httpServer.url = getUrl(httpServer);
        resolve({ ...ctx, http: httpServer });
    });
  });

  return promise;
}

export default init;
