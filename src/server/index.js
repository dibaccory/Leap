import initHttpServer from './http';
import initSocketIO from './socket';
import initMongoDB from './mongodb';

const init = ctx => initHttpServer(ctx).then(initSocketIO).then(initMongoDB);
const config = {port: process.env.PORT || 3000, host: 'localhost'};
init({config});
