import React from 'react';
//import * as io from "socket.io-client";
import crypto from 'crypto';
import { lobbyUpdate, lobbyToggleScroll } from '../../actions/lobby';

const CONFIG = {
  difficulty: 0,
  online: true,
  port: 3001,
  player: {},
  size: 8,
};

class Lobby extends React.Component {
  constructor () {
    super();

  }

  componentDidMount () {
    //window.addEventListener('keydown', e => {key: e.keyCode, });
  }



  render () {

    return (
      <div className="lobby-container">
        <GameContainer/> //previous game (if any)
        <GameContainer/>
        <GameContainer/> //next game (if any)
      </div>
    );
  }
}

export default Lobby;
