import { combineReducers } from 'redux';
import rootReducer from './root';
import lobbyReducer from './Lobby';
import roomReducer from './Room';
import gameReducer from './Game';



const reducer = combineReducers({
  root: rootReducer,
  views: lobbyReducer,
  rooms: roomReducer,
});

export default reducer;
