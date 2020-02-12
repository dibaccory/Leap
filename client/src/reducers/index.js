import { combineReducers } from 'redux';
import rootReducer from './root';

const reducer = combineReducers({
  root: rootReducer,
});

export default reducer;
