import GAME from '../constants/game.types';

export const gameStart = payload => dispatch => dispatch({type: GAME.START, payload});
export const gameMove = payload => dispatch => dispatch({type: GAME.MOVE, payload});
export const gameEnd = payload => dispatch => dispatch({type: GAME.END, payload});
