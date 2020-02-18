import ROOM from '../constants/room.types';

export const roomEnter = payload => dispatch => dispatch({type: ROOM.ENTER, payload});
export const roomExit = payload => dispatch => dispatch({type: ROOM.EXIT, payload});
export const roomAdd = payload => dispatch => dispatch({type: ROOM.ADD, payload});
export const roomDelete = payload => dispatch => dispatch({type: ROOM.DELETE, payload});
