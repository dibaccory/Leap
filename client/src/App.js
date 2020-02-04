import React from 'react';
import * as io from "socket.io-client";
import crypto from 'crypto';
import './App.css';
import './lib/fa/css/all.min.css';
import Settings from './Components/Settings/Settings';
import Leap from './Scenes/Game/Leap';
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
    this.socket.on('connect', () => {
      this.socket.emit('lobbyLoad');
    });
    var name;
    do { name = prompt("username?");}while(!name);
    const player = {
      name: name,
      bot: false,
      color: 'white',
    };

    this.socket.on('lobbyLoadSuccess', games => {
      let lobby = [];
      for (const id in games) {
        lobby.push(
          <button
            key= {id}
            onClick={ () => this.enterGame(id) }>
            Game with { games[id].host }
          </button>
        );
      }
      this.setState({lobby: lobby});
    });

    this.socket.emit('login', player);
    CONFIG.player = player;
    this.state = {
      player: player,
      inGame: '',
      lobby: [],
    };
    this.socket.emit('lobbyLoad');
  }


  componentDidMount () {}

  enterGame(id) {
    this.setState({inGame: id});
  }

  createGame() {
    const id =  crypto.randomBytes(10).toString('hex');
    console.log(id);
    this.socket.emit('gameCreate', {
      id: id,
      whitelist: false,
      host: this.state.player.name,
      hostGoesFirst: true,
      users : {},
    });
    this.enterGame(id);
  }

  exitGame() {}

  render () {

    return (
      <div className="App">
        <Settings/>
        { this.state.inGame ? (
          <Leap io={this.socket} gameid= { this.state.inGame } config={ CONFIG }/>
        ) : (
          <div>
            <div>
              gameroonis
              { (this.state.lobby.length > 0) && this.state.lobby }
            </div>
            <button
              className='start-game-btn'
              onClick={ () => this.createGame() }>
              Create new game
            </button>
          </div>)}
      </div>
    );
  }
}

export default App;
