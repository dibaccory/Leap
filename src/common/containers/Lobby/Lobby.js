import React from 'react';
import { connect } from 'react-redux';
import Room from '../Room';
import crypto from 'crypto';
import { bindActionCreators } from 'redux';
import { getLobbyRooms, getActiveRoom, getMe } from '../../selectors';
import { addRoom, removeRoom, toggleScroll } from '../../actions/lobby.actions';
import { object, string } from 'prop-types';

import './Lobby.css';



const Lobby = ({id, rooms, me, activeRoom}) => {

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
      <Room key={'prev_room'} roomID={roomKeys[prev]} active={false} />,
      <Room key={'display_room'} me={me} roomID={roomKeys[activeRoomIndex]} active={true} />,
      <Room key={'next_room'} roomID={roomKeys[next]} active={false} />
    );
  } else if (size) {
    loadedRooms.push(<Room key={'display_room'} me={me} roomID={roomKeys[activeRoomIndex]} active={true} />);
  } else {
    loadedRooms.push((
      <div key={'non'}>
        <div> Nothing here! </div>
        <button /*TODO: only appear when required input satisfied (sp: just click the playmode, mp: select one of three options)*/
          className='start-game-btn'
          onClick={ () => addRoom()}>
          Start
        </button>
      </div>));
  }


  return (
    <div className= "lobby-container">
      { loadedRooms }
    </div>
  );

};

Lobby.propTypes = {
  me: object,
  rooms: object,
  activeRoom: string,
}

const actions = {
  addRoom,
  removeRoom,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

//TODO: make selectors
const mapStateToProps = state => ({
  me: getMe(state),
  rooms: getLobbyRooms(state),
  activeRoom: getActiveRoom(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
