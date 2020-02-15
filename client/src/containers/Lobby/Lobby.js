import React from 'react';
import * as io from "socket.io-client";
import crypto from 'crypto';
import './lib/fa/css/all.min.css';

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



  render () {

    /*
    have list of available games

    cycle through list if reach either end

    */

    return (
      <div className="lobby-container">
        //<GameContainer/> previous game (if any)
        <GameContainer/>
        //<GameContainer/> next game (if any)
      </div>
    );
  }
}

export default App;
