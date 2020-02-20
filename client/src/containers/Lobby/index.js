import React from 'react';
import Room from '../Room';
import crypto from 'crypto';
import { lobbyUpdate, lobbyToggleScroll } from '../../actions/lobby';

const CONFIG = {
  difficulty: 0,
  online: true,
  port: 3001,
  player: {},
  size: 8,
};

const Lobby = ({
  io,
  index,
  size,
}) => {

  /*
   TODO: add actions
    load Games through up/down arrows
  */

  return (
    <div className="lobby-container">
      {size > 1 && <Room index={(index-1)%size}/>} //previous game (if any)
      <Room index={index}/>
      {size > 1 && <Room index={(index+1)%size}/>} //next game (if any)
    </div>
  );

};
//TODO: make selectors
const mapStateToProps = state => ({
  index: getRoomIndex(state),
  size: getLobbySize(state),

})

export default connect(mapStateToProps)(Lobby);
