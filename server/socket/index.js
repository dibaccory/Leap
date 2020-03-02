import IO from './io';

const init = ctx => {
  const promise = new Promise( resolve => {
    const io = new IO(ctx.http);
    //logger('Socket.io initialized');
    console.log(io);
    resolve({ ...ctx, io: (io.io) });
  });

  return promise;
};

export default init;
