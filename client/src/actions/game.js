import { GAME, PLAYER_ONE, PLAYER_TWO } from '../constants/game.types';

export const start = payload => dispatch => dispatch({type: GAME.START, payload});
export const select = payload => dispatch => dispatch({type: GAME.SELECT, payload});

//export const isPiece = cell =>
