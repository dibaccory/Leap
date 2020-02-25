import { GAME, PLAYER_ONE, PLAYER_TWO } from '../constants/game.types';

export const start = payload => dispatch => dispatch({type: GAME.START, payload});
export const select = payload => dispatch => dispatch({type: GAME.SELECT, payload});
export const cacheMove = payload => dispatch => dispatch({type: GAME.CACHE_MOVE, payload});
export const moveReady = payload => dispatch => dispatch({type: GAME.MOVE_READY, payload});
export const end = payload => dispatch => dispatch({type: GAME.END, payload});
