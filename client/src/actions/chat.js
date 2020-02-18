import CHAT from '../constants/chat.types';

export const chatTyping = payload => dispatch => dispatch({type: CHAT.TYPING, payload});
export const chatSend = payload => dispatch => dispatch({type: CHAT.SEND_MSG, payload});
