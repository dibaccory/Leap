export const GAME = {
  START: 'gameStart',
  MOVE: 'gameMove',
  END: 'gameEnd',
};

export const CHAT = {
  SEND_MSG: 'chatSend',
  TYPING: 'chatTyping',
};

export const ROOM = {
  ENTER: 'roomEnter',
  EXIT: 'roomExit',
  ADD: 'roomAdd',
  DELETE: 'roomDelete',
};

export const USER = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  UPDATE: 'userUpdateInfo',
};

const URL = 'http://localhost';
const PORT = '3001';
export const ENDPOINT = URL + PORT;
