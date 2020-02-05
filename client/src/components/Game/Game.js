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
        board: new Board(this.firstPlayer, BOARD_SIZE, 0), // 0 is phaseLayout
        turn: this.firstPlayer,
        continuedMove: false,
        selectedPiece: null,
        winner: null
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

  loadGame (user, game) {
    const isHost = user.name === game.host;
  //  const sidesFull = !(game.playerOne || game.playerTwo);

    const initGameState = () => {
      const firstPlayer = game.hostGoesFirst ? playerOne : playerTwo;
      const board = new Board(firstPlayer, BOARD_SIZE, 0);
      return {
        online: true,
        board: board,
        turn: firstPlayer,
        continuedMove: false,
        selectedPiece: null,
        winner: null,
        ready: true,
      };
    };

    if(game.hostGoesFirst) {
      game.playerOne = game.playerOne || game.host;
      game.playerTwo = isHost ? game.playerTwo : user.name;
      this.player = isHost ? playerOne : playerTwo;
    } else {
      game.playerOne = isHost ? user.name : game.playerOne;
      game.playerTwo = game.playerTwo || game.host;
      this.player = isHost ? playerTwo : playerOne;
    }

    //if game.board exists, load the game details
    //if game.invite === user.name, then set user as appropriate player
    if (game.board) {
      const board = new Board(game.board.player, BOARD_SIZE, 0);
      game.board = board.set(game.board);
      this.setState({
        online: true,
        board: game.board,
        turn: game.board.player,
        continuedMove: false,
        selectedPiece: null,
        winner: null,
        ready: true,
      });

    } else {
      this.setState(initGameState());
    }
    this.io.emit('gameSet', game);
    PLAYERS[playerOne].name = game.playerOne;
    PLAYERS[playerTwo].name = game.playerTwo;

  }

  componentDidMount() {
    if( this.state.online ) {
      this.io.emit('gameEnter', this.state.id);
      this.io.on('userActive', (player) => {
        console.log(`${player.name} has joined as ${ (this.player & 8) ? 'PLAYER TWO' : 'PLAYER ONE' }`);
      });
    }
  }


  sendMove() {
    this.io.emit('gameBoardSend', this.state.id, board);
  }

  //React update method
  componentDidUpdate(prevProps, prevState) {
    //this.state.board.highlightPieceMoves();
    if (prevState.turn !== this.state.turn) {
      let board = this.state.board;
      if (!board.getAllMoves(this.state.turn)) {
        console.log("${this.state.turn} has no more moves!");
        this.setState({winner: board.switchPlayer()});
      }

      if (PLAYERS[this.state.turn].bot) setTimeout ( () => this.botMove(), 200 );

    } else if (this.state.selectedPiece){ }//if is a move continuation and Counter hasn't started, start the timer
  }

  botMove() {
      var ai = new Bot(this.state.board, 1000);
       this.handleMove(ai.from, ai.to);
  }

  selectCell(cell, index) {
    //If a move is not a continuation, default case,
    if (!this.state.continuedMove) {
      if (this.canSelectPiece(cell)) this.setPiece(cell, index);
      else if (this.state.selectedPiece !== null)  this.handleMove(this.state.selectedPiece, index);
    } else { //if continuation
      //check if move = true..
      let board = this.state.board;
      if (cell & 2) this.handleMove(this.state.selectedPiece, index);
      else {
        board.removeHighlight();
        //TODO: prompt "end turn?" option.
        //right now, let's just end the turn otherwise
        board.switchPlayer();
        if (this.state.online) this.io.emit('gameBoardSend', this.state.id, board);
        this.setState({
          board: board,
          turn: board.player,
          continuedMove: false,
          selectedPiece: null
        });
      }
    }
  }

  handleMove(from, to) {
    const board = this.state.board;
    const pi = board.board[from] >> 5;

    //Have shake animation effect on piece.
    if (!board.validMove(pi, to)) {
      console.log("Invalid move!");
      return;
    }

    //check if win
    if (board.doMove(from, to)) {
      this.setState({winner: board.player});
      return;
    }

    //If we can phase, clone, or capture
    if (board.continuedMove) {
      board.highlightMoves(pi);
      this.setState({
        board: board,
        turn: board.player,
        continuedMove: board.continuedMove,
        selectedPiece: to
      });
    } else {
      if (this.state.online) this.io.emit('gameBoardSend', this.state.id, board);
      this.setState({
        board: board,
        turn: board.player,
        continuedMove: false,
        selectedPiece: null
      });
    }
  }

  canSelectPiece(cell) {
    return (this.state.online)
      ? (cell & 4) && ( (cell & 12) === this.state.turn ) && (this.player === this.state.turn)
      : (cell & 4) && ( (cell & 12) === this.state.turn ) && !PLAYERS[this.state.turn].bot;
  }

  setPiece(cell, index) {
    let board = this.state.board, pi = cell >> 5;
    board.removeHighlight();
    board.highlightMoves(pi);
    this.setState({selectedPiece: index});
      //console.log("selected piece: " + this.state.board.board[row][col].who);
  }

  restart() {
    this.state.board.removeHighlight();
    this.state.board.clearMoves();
    this.setState({ board: new Board(this.firstPlayer, BOARD_SIZE, 0),
                    continuedMove: false, turn: this.firstPlayer, //TODO
                    selectedPiece: null, winner: null });
  }

  render() {
    if (this.state.ready) {
      const player = PLAYERS[this.state.turn].name;
      const turn = player ? `Current Player: ${ player }` : 'Waiting for player...' ;

      return (
        <div className="Leap">
          { this.state.winner && <Winner player={PLAYERS[this.state.winner]} restart={this.restart.bind(this)} /> }
          <h3>
            {turn}
            <span className={PLAYERS[this.state.turn].class+"-token"}></span>
          </h3>
          <div className="game-container">
            <div className="game-options"></div>
            <GameBoard board={this.state.board}
                       size={BOARD_SIZE}
                       players={PLAYERS}
                       selectedPiece={this.state.selectedPiece}
                       selectCell={this.selectCell.bind(this)} />
            <div className="game-menu"></div>
          </div>
        </div>
      );
    } else return <div className="Leap">LOADING</div>;
  }
}

export default Leap;
