const USER = {
  LOGIN: 'userLogin',
  LOGOUT: 'userLogout',
  UPDATE: 'userUpdateInfo',
};

const LOBBY = {
  UPDATE: 'update',
  TOGGLE_SCROLL: 'toggleScroll',
  ADD_ROOM: 'addRoom',
  REMOVE_ROOM: 'removeRoom',
};

const ROOM = {
  ENTER: 'roomEnter',
  EXIT: 'roomExit',
  END_GAME: 'gameEnd',
  SUBMIT_MOVE: 'submitMove',
  FETCH_ROOMS: 'fetchRooms',
};

const GAME = {
  START: 'gameStart',
  END: 'gameEnd',
  SELECT: 'gameSelectCell',
  CACHE_MOVE: 'cacheMove',
  MOVE_READY: 'moveReady',
  //SUBMIT: 'submitMove',
};

const CHAT = {
  SEND_MSG: 'chatSend',
  TYPING: 'chatTyping',
};

const URL = 'http://localhost';
export const PORT = '3001';
export const ENDPOINT = URL + PORT;

export { USER, LOBBY, ROOM, GAME, CHAT };
