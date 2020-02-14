import IO from './io';
import listeners from './listeners';

const init = ctx => {
  const promise = new Promise( resolve => {
    IO(ctx.http);
    //logger('Socket.io initialized');
    resolve({ ...ctx, IO.io });
  });

  return promise;
};


export default init;
