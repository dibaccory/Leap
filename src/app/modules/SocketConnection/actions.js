import { ENDPOINT } from './constants';
const host = ENDPOINT;
export const wsConnect = () => ({type: 'connect', host: host});
export const wsConnecting = () => ({type: 'connecting', host: host});
export const wsConnected = () => ({type: 'connected', host: host});
export const wsDisconnect = () => ({type: 'disconnect', host: host});
export const wsDisconnected = () => ({type: 'disconnected', host: host});

export default {
  wsConnect,
  wsConnecting,
  wsConnected,
  wsDisconnect,
  wsDisconnected
};
