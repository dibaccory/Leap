import { createStore, applyMiddleware, compose } from 'redux';
import socket from '../middleware/socket';
import thunk from 'redux-thunk';
import reducer from '../reducers';
//import DevTools from '../containers/DevTools';

const middleware = [thunk, socket];

const initStore = compose(
  applyMiddleware(...middleware),
  //DevTools.instrument()
)(createStore);

export default function configureStore (initialState) {
  return initStore(reducer, initialState);
};
