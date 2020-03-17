import { USER } from './constants';

export const userLogin = payload => ({type: USER.LOGIN, payload: payload});
export const userLogout = payload => ({type: USER.LOGOUT, payload});


export default {
  userLogin,
  userLogout,
};
