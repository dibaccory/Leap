import io from 'socket.io-client';
import { messageTypes, uri } from './constants/index';

export default function Socket () {
  const socket = io.connect(ENDPOINT);

  return {

  };
}
