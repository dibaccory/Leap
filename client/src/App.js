import React, { useState } from 'react';
import socketIOClient from "socket.io-client";
import crypto from 'crypto';
import './css/App.css';
import './lib/fa/css/all.min.css';
import { CSSTransition } from 'react-transition-group';
import Settings from './Settings';
import Leap from './Leap';
import Menu from './Menu';

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
    this.socket = socketIOClient(`http://localhost:${CONFIG.port}`);
    var name;
    do { name = prompt("username?");}while(!name);
    const player = {
      name: name,
      bot: false,
      color: 'white',
    };
    this.socket.emit('login', player);
    CONFIG.player = player;
    this.state = {
      player: player,
      inGame: '',
      lobby: [],
    };

    this.socket.emit('lobbyLoad');
    this.socket.on('lobbyLoadSuccess', games => {
      let lobby = [];
      for (const id in games) {
        lobby.push(
          <button
            key= {id}
            onClick={ () => this.setState({inGame: id}) }>
            Game with { games[id].host }
          </button>
        );
      }
      this.setState({lobby: lobby});
    });

    console.log(this.state.lobby);


  }


  componentDidMount () {

  }



  exitGame() {

  }


  render () {



    const createGame = () => {
      const id =  crypto.randomBytes(10).toString('hex');
      console.log(id);
      this.socket.emit('gameCreate', {
        id: id,
        whitelist: false,
        host: this.state.player.name,
        users : {},
      });

      //this.socket.emit('sendGames');
    }

    return (
      <div className="App">
        <Settings/>
        <div>
          gameroonis
          { (this.state.lobby.length > 0) && this.state.lobby }
        </div>
        <button
          className='start-game-btn'
          onClick={ () => createGame() }>
          Create new game
        </button>
        { this.state.inGame && <Leap gameid= { this.state.inGame } config={ CONFIG }/> }
      </div>
    );
  }
}



export default App;
