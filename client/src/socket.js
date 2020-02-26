import socketIOClient from 'socket.io-client';
import store from './store/';
import { ENDPOINT } from './constants/socket.types';

function Socket (store) {
  this.io = socketIOClient.connect(ENDPOINT);

  this.io
    .on('recieveMove', data => {
      console.log(data);
    });
}


const socket = new Socket(store);
export default socket;
