import React from 'react';
import Room from '../Room';
import crypto from 'crypto';
import { lobbyUpdate, lobbyToggleScroll } from '../../actions/lobby';

// const CONFIG = {
//   difficulty: 0,
//   online: true,
//   port: 3001,
//   player: {},
//   size: 8,
// };

const Lobby = (rooms, activeRoomID) => {

  /*
   TODO: add actions
    load Games through up/down arrows + or - state roomIndex
  */

  return (
    <div className= "lobby-container">
      { Object.entries(rooms).map( [id, ctx] => (
        <Room key={id} {...ctx} active={id === activeRoomID} />
      )) }
    </div>
  );

};
//TODO: make selectors
const mapStateToProps = state => ({
  rooms: getLobbyRooms(state),
  activeRoomID: getActiveRoomID(state),

})

export default connect(mapStateToProps)(Lobby);
