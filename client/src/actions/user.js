import { USER } from '../constants/user.types';

export const userLogin = payload => ({type: USER.LOGIN, payload: payload});
export const userLogout = payload => dispatch => dispatch({type: USER.LOGOUT, payload});
export const userUpdateInfo = payload => dispatch => dispatch({type: USER.UPDATE, payload});
