import http from 'http';
import express from 'express';

export const getUrl = server => `http://${server.address().address}:${server.address().port}`;

const init = ctx => {
  const { config } = ctx;
  console.log('config: ', config)
  const { port } = config;
  const app = express();
  const router = express.Router();
  router.get('/', (req, res) => { res.send({response: 'router test' }) } );
  app.use(router);
  const server = http.createServer(app);
  const promise = new Promise( resolve => {
    server.listen(port, () => {
        console.log('server: ', server.address())
        server.url = getUrl(server);
        resolve({ ...ctx, http: server });
    });
  });

  return promise;
}

export default init;
