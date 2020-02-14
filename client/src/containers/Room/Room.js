import React, { Component } from 'react';
import './ui.css';
import Game from './Game';
import Leap from './assets/leap.js';
//import { Winner } from '../Announcements';

const playerOne = 4;
const playerTwo = 12;
var PLAYERS;
var BOARD_SIZE;

class Room extends Component {
  /*
  props:
    online: bool
    gameid: HASH
    user: {
      id: HASH
      name: string
      icon: yee
    }
  */
  constructor(props) {
    super(props);
    BOARD_SIZE = props.config.size;
    PLAYERS = {
      [playerOne]: {
        class: "player-one"
      },
      [playerTwo]: {
        class: "player-two"
      }
    }

    if(props.config.online) {
    //  const endpoint = ( window.location.origin + `//:${ props.config.port }` );
      const gameBoardRecieve = b => {
        const board = this.state.board.set(b);
        this.setState({board: board, turn: board.player});
      };
      this.state = {online: true, id: props.gameid, ready: false};
      this.io = props.io;
      this.io.on('gameBoardRecieve', board => gameBoardRecieve(board));
      this.io.on('gameLoad', (user, game) => this.loadGame(user, game));

    } else {} //LOCAL GAME

  }

  

  componentDidMount () {
    if( this.state.online ) {
      this.io.emit('gameEnter', this.state.gameid);
    }
  }

  componentWillUnmount () {  //User swipes up in the lobby
    //save board snapshot
  }

  handleMove (game) {
    if (this.state.online) this.io.emit('gameBoardSend', this.state.id, game);

    //this.io.emit('gameBoardSend', this.state.id, game);
  }

  componentDidUpdate(prevProps, prevState) {  // Send previous board to Board for animation purposes

  }


  render() {
    if (this.state.ready) {
      const player = PLAYERS[this.state.turn].name;
      const turn = player ? `Current Player: ${ player }` : 'Waiting for player...' ;

      return (
        <div className="room-container">
          <PlayerHeader user={}/>
          <Game game={this.state.game} size={BOARD_SIZE} players={PLAYERS}/>
          <PlayerHeader user={}/>
        </div>
      );
    } else return <div className="room-container">LOADING</div>;
  }
}

export default Room;
