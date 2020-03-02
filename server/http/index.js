import http from 'http';
import express from 'express';

const getUrl = server => `http://${server.address().address}:${server.address().port}`;
const bindCtx = (ctx) => (req, res, next) => {
  req.ctx = ctx;
  next();
};

const init = ctx => {
  const { config } = ctx;
  console.log('config: ', config)
  const { port, host } = config;
  const app = express();
  const router = express.Router();
  router.get('/', (req, res) => { res.send({response: 'router test' }) } );
  app.use(router);
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
