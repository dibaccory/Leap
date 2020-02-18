import USER from '../constants/user.types';

export const userLogin = payload => dispatch => dispatch({type: USER.LOGIN, payload});
export const userLogout = payload => dispatch => dispatch({type: USER.LOGOUT, payload});
export const userUpdateInfo = payload => dispatch => dispatch({type: USER.UPDATE, payload});
