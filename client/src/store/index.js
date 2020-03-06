import { createStore, applyMiddleware, compose } from 'redux';
import socket from '../middleware/socket';
import thunk from 'redux-thunk';
import reducer from '../reducers/';

const middleware = [thunk, socket];

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
);

export default store;
