import Leap from '../assets/leap';

export const getMe = state => state.root.me;
export const getIsLoggedIn = state => state.root.isLoggedIn;
export const getRooms = state => state.rooms;

export const getLobbyRooms = state => {
  const rooms = state.rooms;
  if(!Object.keys(rooms).length) return {};
  return state.views[state.root.activeView].rooms.reduce( (obj,room) => ({...obj, [room]: rooms[room]}), {} );
};

export const getActiveRoom = state => {
  const view = state.views[state.root.activeView];
  return view.activeRoom;
}

//TODO: do emit instead and grab from server
export const getRoom = state => state.rooms[getActiveRoom(state)];
export const getUsers = state => getRoom(state).users;
export const getGame = state => new Leap().set(getRoom(state).game);
export const getHost = state => getRoom(state).host;


export const getUserPlaymode = state => {
  const player = getRoom(state).player;
  const id = getMe(state).id
  if (player.one === id) return 4;
  else if(player.two === id) return 12;
  else return 8;
};

//LOCAL
const isCachedMoveForThisRoom = state => (state.rooms[getActiveRoom(state)] === state.root.cachedGame.room);
export const getMoveSelectionsForActiveGame = state => isCachedMoveForThisRoom(state) ? state.root.cachedGame.move : null;
export const getMoveStatusForActiveGame = state => isCachedMoveForThisRoom(state) ? state.root.cachedGame.isMoveReadyToSubmit : false;
