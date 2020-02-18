import LOBBY from '../constants/lobby.types';

export const lobbyUpdate = payload => dispatch => dispatch({type: LOBBY.UPDATE, payload});
export const lobbyToggleScroll = payload => dispatch => dispatch({type: LOBBY.TOGGLE_SCROLL, payload});
