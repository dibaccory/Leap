import IO from './io';

const init = ctx => {
  const promise = new Promise( resolve => {

    //logger('Socket.io initialized');
    resolve({ ...ctx, io: (new IO(ctx.http).io) });
  });

  return promise;
};

export default init;
