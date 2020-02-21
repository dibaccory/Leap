export const getMe = state => state.root.me;
export const getIsLoggedIn = state => state.root.isLoggedIn;
export const getRooms = state => state.rooms;

export const getLobbyRooms = state => {
  console.log(state);
  const rooms = state.rooms;
  return state.views[state.root.activeView].rooms.reduce( (obj,room) => ({...obj, [room]: rooms[room]}), {} );
};

export const getActiveRoom = state => {
  const view = state.views[state.root.activeView];
  return view.rooms[view.activeRoom];
}

//TODO: do emit instead and grab from server
export const getUsers = state => state.rooms[getActiveRoom(state)].users;
export const getGame = state => state.rooms[getActiveRoom(state)].game;
export const getHost = state => state.rooms[getActiveRoom(state)].host;


//LOCAL
export const getMoveSelections = state => state.cachedGame.move;
