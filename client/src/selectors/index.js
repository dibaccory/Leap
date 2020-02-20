export const getRooms = state => state.rooms;

export const getLobbyRooms = state => {
  const rooms = state.rooms;
  return state.views[state.activeView].rooms.map( room => rooms[room] );
};

export const getActiveRoomID = state => state.views[state.activeView].activeRoomID;

export const getUsers = state => state.rooms[getActiveRoomID(state)].users;
export const getGame = state => state.rooms[getActiveRoomID(state)].game;
export const getHost = state => state.rooms[getActiveRoomID(state)].host;
