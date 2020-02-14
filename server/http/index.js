import http from 'http';
import express from 'express';

const init = ctx => {
  const { config } = ctx;
  console.log('config: ', config)
  const { server: { port } } = config;
  const app = express();
  const router = express.Router();
  router.get('/', (req, res) => { res.send({response: 'router test' }) } );
  app.use(router);
  const server = http.createServer(app);
  const promise = new Promise( resolve => {
    server.listen(PORT, () => {
        console.log('server: ', server.address())
        httpServer.url = getUrl(server);
        resolve({ ...ctx, http: server });
    });
  });

  return promise;
}

export default init;
