import { combineReducers } from 'redux';
import rootReducer from './root';
import lobbyReducer from './lobby.reducer';
import roomReducer from './room.reducer';
import gameReducer from './game.reducer';



const reducer = combineReducers({
  root: rootReducer,
  views: lobbyReducer,
  rooms: roomReducer,
});

export default reducer;
