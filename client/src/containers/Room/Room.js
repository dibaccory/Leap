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

  loadGame (user, room) {
    const isHost = user.name === room.host;
  //  const sidesFull = !(room.playerOne || room.playerTwo);

    const initGameState = () => {
      const firstPlayer = room.hostGoesFirst ? playerOne : playerTwo;
      const game = new Leap(firstPlayer, BOARD_SIZE, 0);
      return {
        online: true,
        game: game,
        ready: true,
      };
    };

    if(room.hostGoesFirst) {
      room.playerOne = room.playerOne || room.host;
      room.playerTwo = isHost ? room.playerTwo : user.name;
      this.player = isHost ? playerOne : playerTwo;
    } else {
      room.playerOne = isHost ? user.name : room.playerOne;
      room.playerTwo = room.playerTwo || room.host;
      this.player = isHost ? playerTwo : playerOne;
    }

    //if room.board exists, load the room details
    //if room.invite === user.name, then set user as appropriate player
    if (room.board) {
      const game = new Leap(room.game.player, BOARD_SIZE, 0);
      room.game = game.set(room.game);
      this.setState({
        online: true,
        game: room.game,
        ready: true,
      });

    } else {
      this.setState(initGameState());
    }
    this.io.emit('gameSet', room);
    PLAYERS[playerOne].name = room.playerOne;
    PLAYERS[playerTwo].name = room.playerTwo;

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
