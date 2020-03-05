import {LOBBY} from '../constants/lobby.types';

export const update = payload => ({type: LOBBY.UPDATE, payload});
export const toggleScroll = payload => ({type: LOBBY.TOGGLE_SCROLL, payload});
export const addRoom = payload => ({type: LOBBY.ADD_ROOM, payload});
export const removeRoom = payload => ({type: LOBBY.REMOVE_ROOM, payload});

export default {
  update,
  toggleScroll,
  addRoom,
  removeRoom,
};
