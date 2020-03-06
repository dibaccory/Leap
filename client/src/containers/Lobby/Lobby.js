import React from 'react';
import { connect } from 'react-redux';
import Room from '../Room';
import crypto from 'crypto';
import { getLobbyRooms, getActiveRoom } from '../../selectors/';
//import { lobbyUpdate, lobbyToggleScroll } from '../../actions/lobby.actions';
import { object, string } from 'prop-types';

import './Lobby.css';


const Lobby = ({id, rooms, activeRoom}) => {

  /*
   TODO: add actions
    load Games through up/down arrows + or - state roomIndex
  */
  const roomKeys = Object.keys(rooms);
  const activeRoomIndex = roomKeys.indexOf(activeRoom);
  const size = roomKeys.length;
  let loadedRooms = [];
  if (size > 1) {
    const prev = Math.abs( (activeRoomIndex-1)%size );
    const next = (activeRoomIndex+1)%size;
    loadedRooms.push(
      <Room key={'prev_room'} room={rooms[roomKeys[prev]].id} active={false} />,
      <Room key={'display_room'} room={rooms[roomKeys[activeRoomIndex]].id} active={true} />,
      <Room key={'next_room'} room={rooms[roomKeys[next]].id} active={false} />
    );
  } else if (size) {
    loadedRooms.push(<Room key={'display_room'} room={rooms[roomKeys[activeRoomIndex]].id} active={true} />);
  } else {
    loadedRooms.push( (<div> LMAO NUTTIN </div>) );
  }


  return (
    <div className= "lobby-container">
      { loadedRooms }
    </div>
  );

};

Lobby.propTypes = {
  rooms: object,
  activeRoom: string,
}

//TODO: make selectors
const mapStateToProps = state => ({
  rooms: getLobbyRooms(state),
  activeRoom: getActiveRoom(state),

})

export default connect(mapStateToProps)(Lobby);
