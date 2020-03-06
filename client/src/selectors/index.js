import Leap from '../assets/leap';

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
export const getRoom = state => state.rooms[getActiveRoom(state)];
export const getUsers = state => getRoom(state).users;
export const getGame = state => new Leap().set(getRoom(state).game);
export const getHost = state => getRoom(state).host;


//LOCAL
const isCachedMoveForThisRoom = state => (state.rooms[getActiveRoom(state)] === state.root.cachedGame.room);
export const getMoveSelectionsForActiveGame = state => isCachedMoveForThisRoom(state) ? state.root.cachedGame.move : null;
export const getMoveStatusForActiveGame = state => isCachedMoveForThisRoom(state) ? state.root.cachedGame.isMoveReadyToSubmit : false;
