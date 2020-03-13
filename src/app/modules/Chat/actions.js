import CHAT from './constants';

export const chatTyping = payload => dispatch => dispatch({type: CHAT.TYPING, payload});
export const chatSend = payload => dispatch => dispatch({type: CHAT.SEND_MSG, payload});

export default {
  chatTyping,
  chatSend,
};
