import socketIOClient from 'socket.io-client';
//import store from './store/';
import { ENDPOINT } from './constants/socket.types';

function Socket () {
  this.io = socketIOClient.connect('ws://localhost:3001');

  this.io
    .on('connect', () => console.log('howdy'))
    .on('recieveMove', data => {
      console.log(data);
    });
}



export default (new Socket());
