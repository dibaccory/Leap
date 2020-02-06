import React from 'react';
import {cellType, CELL_COLORS} from './assets/util.js';
import Leap from './assets/leap.js';
import {UCT as Bot} from './assets/ai.js';

const BOT_COEFF = 1000;
var BOARD_SIZE;
var PIECE_COLORS;

class Board extends React.Component {

  constructor (props) {
    super();
  BOARD_SIZE = props.size;
  PLAYERS = props.players;

  this.submit = props.handleMove.bind(this);
  this.endGame = props.handleEndGame.bind(this);

  /*
  user: {
    value: {PLAYER | SPECTATOR}
    isBot: range (0 , 10) 0 = not a bot, 1-10 = bot difficulty
  }
  */
  this.state = {
    game: props.game,
    user: props.user,
    move: { from: undefined, to: undefined},
  }

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


  selectCell (cell, index) {
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
      const isPiece = (cell & 8) | (cell & 4);
      const isSelectablePiece = !(isPiece ^ user.value);
      const isTurn = user.value === game.turn;
      const canSelectPiece = isSelectablePiece && isTurn;
      if (canSelectPiece) this.setPiece(cell, index);
      else if()
    }



    if (!this.state.game.continuedMove) {
      //if cell has piece, piece belongs to user, and it's this users' turn

      else if ()
      else if (cell & 2) this.handleMove(this.state.piece, index);
      else console.log();
    } else {
      //check if move = true..
      let board = this.state.game;
      if (cell & 2) this.handleMove(this.state.piece, index);
      else {
        board.removeHighlight();

        //right now, let's just end the turn otherwise
        board.switchPlayer();
        if (this.state.online) this.io.emit('gameBoardSend', this.state.id, board);
        this.setState({
          board: board,
          piece: null
        });
      }
    }
  }

  setPiece (cell, index) {
    let board = this.state.game, pi = cell >> 5;
    board.removeHighlight();
    board.highlightMoves(pi);
    this.setState({piece: index});
      //console.log("selected piece: " + this.state.game.board[row][col].who);
  }

  setDestination (to) {
    this.setState({move: {from: this.state.move.from, to: to} });
  }



  move() {
    //const from = this.state.move.from;
    //const to = this.state.move.to;
    const game = this.state.game;
    const pi = game.board[from] >> 5;

    //check if win
    if (game.doMove(from, to)) {
      this.endTurn(true);
      return;
    }

    //If we can phase, clone, or capture
    if (game.continuedMove) {
      game.highlightMoves(pi);
      this.setState({ game: game, piece: to});
    } else {
      //if (this.state.online) this.io.emit('gameBoardSend', this.state.id, game);
      this.setState({
        game: game,
        piece: null
      });
    }
  }

  botMove () {
      var ai = new Bot(this.state.game, this.state.user.isBot*BOT_COEFF);
       this.handleMove(ai.from, ai.to);
  }

  endTurn (gameOver) {
    const { game, user } = this.state;
    if (gameOver) this.endGame(game.turn);
    else {
      game.removeHighlight();
      this.setState({game: game, move: {from: undefined, to: undefined}});
    }

    this.submit(this.state);
  }

  render () {
    let rows = [];
    for(let r = 0; r < BOARD_SIZE; r++) {
      rows.push(<Row
        key={r}
        row={r}
        board={this.state.game.board}
        piece={props.piece}
        selectCell={props.selectCell} />);
      }
    return (<div className="board"> {rows} </div>);
  }
}

function Row(props) {
  let cells = [], index, cell;
  for(let c=0; c< BOARD_SIZE; c++) {
    index = props.row*BOARD_SIZE + c;
    cell = props.board[index];
    cells.push(<Cell
      key={ index } //board index
      index={ index }
      val={ cell } //cell info
      row={ props.row }
      col={c}
      highlight={props.board[index] & 2}
      selected={index === props.piece}
      selectCell={props.selectCell} />);
  }
  return (<span className="row"> { cells } </span>);
}

function Cell(props) {
  let color = CELL_COLORS[cellType(props.index)];
  let highlight = props.highlight ? " highlight" : "";
  let classes = "cell " + color + highlight;
  //TODO: (props.val & 12) > 0) also counts for "special cell" replace this in future
  return (
    <div className={classes} onClick={ () => props.selectCell(props.val, props.index) }>
      { ((props.val & 12) > 0) && <Piece
        key={props.val >> 5}
        player={props.val & 12}
        cloned={(props.val >> 4) & 16}
        selected={props.selected} />}
    </div>
  );
}

function Piece(props) {
  let classes = "";
  classes += (props.player );
  if (props.cloned) classes += " cloned";
  if (props.selected) {
    classes += " selected";
  }
  return (<div className={classes}></div>);
}

export default Board;
