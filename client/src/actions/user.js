import { USER } from '../constants/user.types';

export const userLogin = payload => ({type: USER.LOGIN, payload: payload});
export const userLogout = payload => ({type: USER.LOGOUT, payload});
//export const userExit = payload => ({type: 'userExit', payload});
export const userUpdateInfo = payload => ({type: USER.UPDATE, payload});
