import {LOBBY} from '../constants/lobby.types';

export const update = payload => dispatch => dispatch({type: LOBBY.UPDATE, payload});
export const toggleScroll = payload => dispatch => dispatch({type: LOBBY.TOGGLE_SCROLL, payload});
export const addRoom = payload => dispatch => dispatch({type: LOBBY.ADD_ROOM, payload});
export const removeRoom = payload => dispatch => dispatch({type: LOBBY.REMOVE_ROOM, payload});
