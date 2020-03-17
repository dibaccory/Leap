import http from 'http';
import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackConfig from '../../../webpack.config.dev';
import { getUrl, bindCtx, renderFullPage } from './util';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import {configureStore} from '../../app';
import mongoose from 'mongoose';


const init = ctx => {
  const { config } = ctx;
  const { port, host } = config;
  console.log(`Our endpoint: ${host}:${port}`)
  mongoose.connect(`mongodb://${host}/Leap`, {useNewUrlParser: true, useUnifiedTopology: true});
  const app = express();
  const router = express.Router();
  app.use(router);
  //app.use(passport.initialize());
  if (process.env.NODE_ENV === 'development') {
    const compiler = webpack(webpackConfig);
    app.use(require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath
    }));
  }
  app.use('/', express.static(path.join(__dirname, '../../..', 'static')));
  app.get('/*', (req, res) => {

    const store = configureStore();
    const InitialView = (
    <Provider store={store}>
    </Provider>);

    const initialState = (process.env.NODE_ENV === 'production')
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
