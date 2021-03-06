import React, {useEffect, useState} from 'react';
import {cellType, CELL_COLORS} from './assets/util.js';
import {UCT as Bot} from './assets/ai.js';

const BOT_COEFF = 1000;
var BOARD_SIZE;
var PIECE_COLORS;

class Game extends React.Component {

  constructor (props) {
    super();
  BOARD_SIZE = props.size;
  PLAYERS = props.players;

  this.submit = props.handleMove.bind(this);
  this.endGame = props.handleEndGame.bind(this);

  this.state = {
    game: props.game,
    user: props.user, //value, isBot, color
    move: { from: undefined, to: undefined, captured: undefined},
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

  componentDidMount () {
    if(this.state.user.isBot) this.botMove();
    else this.state.game.getAllMoves(this.state.game.turn);
  }

  //TODO: get previous move, use this to
  componentDidUpdate (prevProps, prevState) {
    const { game, user } = this.state;
    if (game.turn === user.value) {
      if (!game.getAllMoves(game.turn)) {
        console.log(`${game.turn} has no more moves!`);
        this.endTurn(true);
      }
      else if (user.isBot) this.botMove();
    }
  }

  selectCell (cell, index) { //call implies it's this user's turn
    const { game, user } = this.state;
    const highlighted = (cell & 2);

    if (game.continuedMove) { //implies current user is moving
      if (highlighted) this.setDestination(index);
      else {
        //TODO: prompt "end turn?" option
        game.switchPlayer(); //sketchy
        this.endTurn();
      }
    } else {
      const pieceType = cell & (8 | 10 | 12);
      if (pieceType) {  //if piece
        const isSelectablePiece = !(pieceType ^ user.value) || pieceType === 10;
        const hasMoves = game.moves[cell >> 5].length > 0;

        if (canSelectPiece && hasMoves) this.setPiece(cell, index);
        else try {
          if (canSelectPiece) throw 'PIECE HAS NO MOVES';
          if (hasMoves) throw 'OPPONENT PIECE';
        } catch (error) {
          console.log(`CANNOT SELECT: ${error}`);
        }
      }
      else {  //if empty cell
        if (cell & 2) this.move();
        else console.log('CANNOT SELECT: NOT EMPTY');
      }
  }
}

  setPiece (cell, index) {
    const { game } = this.state;
    const pi = cell >> 5;
    game.removeHighlight();
    game.highlightMoves(pi);
    this.setState({piece: index});
  }

  setDestination (to) {
    this.setState({ move: {from: this.state.move.from, to: to, captured: this.state.game.board[]} });
  }

  move() {
    const { game, move } = this.state;
    const { from, to } = move;
    const pi = game.board[from] >> 5;

    if (game.doMove(from, to)) { //win
      this.endTurn(true);
      return;
    } else if (game.continuedMove) {
      game.highlightMoves(pi);
      this.setState({ game: game, move: {to: to, from: undefined, captured: undefined} });
    } else {
      this.endTurn();
    }
  }

  botMove () {
      var ai = new Bot(this.state.game, this.state.user.isBot*BOT_COEFF);
       this.move();
  }

  endTurn (gameOver) {
    const { game, user } = this.state;
    if (gameOver) this.endGame(game.turn);
    else {
      game.removeHighlight();
      this.setState({ game: game, move: {from: undefined, to: undefined, captured: undefined} });
    }

    this.submit(this.state);
  }

  render () {
    { game, move } = this.state;
    const isTurn = user.value === game.turn;
    const selectAction = isTurn ? props.selectCell.bind(this) : console.log('NOT UR TURN');
    /*  display: grid for the cells  */
    let cells = [];
    for (let index = 0; index < game.board.length; index++) {
      const cell = game.board[index];
      const selected = (move.to === index && 'to') || (move.from === index && 'from') || (move.captured === index && 'captured') || '';

      cells.push(<Cell
        key={index}
        index={index}
        cell={cell}
        highlight={cell & 2}
        selected={selected}
        select={selectAction} />);
    }

    return (<div className="board"> { cells } </div>);
  }
}

function Cell(props) {
  const { cell, index, selected } = props;
  const color = CELL_COLORS[cellType(index)];
  const status = selected || (highlight ? 'possible' : '');
  const classes = `cell ${color} ${(status ? 'move-'+status : '')}`;

  return (
    <div className={classes} onClick={ () => props.select(cell, index) }>
      { ((cell & 12) > 0) && <Piece
        key={cell >> 5}
        player={cell & 12}
        cloned={(cell >> 4) & 16}
        selected={selected} />}
    </div>
  );
}

function Piece(props) {
  const {...props} = props;
  const pieceColor = (player === 8 && 'white') || (player === 12 && 'black') || 'superposed';
  const classes = `piece ${cloned && 'cloned'} ${pieceColor}`;
  return (<div className={classes} ></div>);
}

export default Game;
