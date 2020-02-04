import React from 'react';
import * as io from "socket.io-client";
import crypto from 'crypto';
import './App.css';
import './lib/fa/css/all.min.css';
import Settings from './Components/Settings';
import Leap from './Scenes/Game';
//import Menu from './Menu';

const CONFIG = {
  difficulty: 0,
  online: true,
  port: 3001,
  player: {},
  size: 8,
};

class App extends React.Component {
  // add back   <Menu/>
  //If roomURL isn't empty, then Multiplayer
  //go to roomURL.
  constructor () {
    super();
    this.socket = io.connect(`http://localhost:${CONFIG.port}`);

    //CONFIG.player = player;
    this.state = {
      player: player,
      inGame: '',
    };

  }

  render () {

    //const isLoggedIn
    const mainPanel = this.state.inGame
      ? <Leap config={this.state.config}/>
      : <Lobby/>

    return (
      <div className="App">
        <Title/>
        <Menu/> //Profile, Settings  in lobby: Leaderboard | in game: Back, Resign
        { mainPanel }
        //<Chat/> //changes room based on game or lobby
      </div>
    );
  }
}

export default App;
