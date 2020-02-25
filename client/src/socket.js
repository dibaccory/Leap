import socket from 'socket.io-client';
import { ENDPOINT } from './constants/socket.types';

export default function Socket (store) {
  const io = socket.connect(ENDPOINT);

  io
    .on('recieveMove', data => {
      console.log(data);
    });
}
