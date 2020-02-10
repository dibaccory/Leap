import React, { Component } from 'react';
import './ui.css';
import Board from './Board';
//import { Winner } from '../Announcements';

const playerOne = 4;
const playerTwo = 12;
var PLAYERS;
var BOARD_SIZE;

class Game extends Component {
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

    } else {
      //LOCAL GAME
      this.firstPlayer = props.config.players[0].first ? playerOne : playerTwo;
      this.state = {
        online: false,
        game: new Leap(this.firstPlayer, BOARD_SIZE, 0), // 0 is phaseLayout
      };
      PLAYERS = {
        [playerOne]: {
          ...props.config.players[0],
          class: "player-one"
        },
        [playerTwo]: {
          ...props.config.players[1],
          class: "player-two"
        }
      }
    }

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

  componentDidMount() {
    if( this.state.online ) {
      this.io.emit('gameEnter', this.state.id);
      this.io.on('userActive', (player) => {
        console.log(`${player.name} has joined as ${ (this.player & 8) ? 'PLAYER TWO' : 'PLAYER ONE' }`);
      });
    }
  }

  handleMove (game) {
    if (this.state.online) this.io.emit('gameBoardSend', this.state.id, game);

    //this.io.emit('gameBoardSend', this.state.id, game);
  }

  //React update method
  componentDidUpdate(prevProps, prevState) {
    //this.state.board.highlightPieceMoves();
    if (prevState.turn !== this.state.turn) {
      let board = this.state.game;
      if (!board.getAllMoves(this.state.turn)) {
        console.log("${this.state.turn} has no more moves!");
        this.setState({winner: board.switchPlayer()});
      }

      if (PLAYERS[this.state.turn].bot) setTimeout ( () => this.botMove(), 200 );

    } else if (this.state.selectedPiece){ }//if is a move continuation and Counter hasn't started, start the timer
  }


  render() {
    if (this.state.ready) {
      const player = PLAYERS[this.state.turn].name;
      const turn = player ? `Current Player: ${ player }` : 'Waiting for player...' ;

      return (
        <div className="game-container">
          <h3>
            {turn}
            <span className={PLAYERS[this.state.turn].class+"-token"}></span>
          </h3>
          <Board
            game={this.state.game}
            size={BOARD_SIZE}
            players={PLAYERS}
          />
        </div>
      );
    } else return <div className="game-container">LOADING</div>;
  }
}

export default Game;
