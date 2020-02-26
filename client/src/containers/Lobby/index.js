import React from 'react';
import { connect } from 'react-redux';
import Room from '../Room';
import crypto from 'crypto';
import { getLobbyRooms, getActiveRoom } from '../../selectors/';
import { lobbyUpdate, lobbyToggleScroll } from '../../actions/lobby';

// const CONFIG = {
//   difficulty: 0,
//   online: true,
//   port: 3001,
//   player: {},
//   size: 8,
// };

const Lobby = ({id, rooms, activeRoom}) => {

  /*
   TODO: add actions
    load Games through up/down arrows + or - state roomIndex
  */

  return (
    <div className= "lobby-container">
      { Object.entries(rooms).map( ([id, ctx]) => (
        <Room key={id} room={id} {...ctx} active={id === activeRoom} />
      )) }
    </div>
  );

};
//TODO: make selectors
const mapStateToProps = state => ({
  rooms: getLobbyRooms(state),
  activeRoom: getActiveRoom(state),

})

export default connect(mapStateToProps)(Lobby);
