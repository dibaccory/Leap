import initHttpServer from './http';
import initSocketIO from './socket';

const init = ctx => initHttpServer(ctx).then(initSocketIO);
const config = {port: process.env.PORT || 3000, host: 'localhost'};
init({config});
