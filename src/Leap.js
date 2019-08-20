import React, { Component } from 'react';
import './css/ui.css';
import Board from './js/board.js';
import Countdown from 'react-countdown-now';
var util = require('./js/util.js');

/*
TODO:
highlight pieces

Game description:


"How to Play":
-directions
-tutorial?

Check HTML integrity (if somebody is editing it, get mad lol)

multiplayer



*/

const BOARD_SIZE = 8;
const PLAYER_ONE = 1;
const PLAYER_TWO = 2;
const PLAYERS = {
  [PLAYER_ONE]: {
    name: "Player One",
    class: "player-one"
  },
  [PLAYER_TWO]: {
    name: "Player Two",
    class: "player-two"
  }
}

const CELL_COLORS = [ "gray1", "gray2", "pink", "red", "orange", "yellow", "green", "blue"];

class Leap extends Component {
  constructor() {
    super();
    this.state = { board: new Board(BOARD_SIZE, PLAYER_ONE, PLAYER_TWO),
                  turn: PLAYER_ONE,
                  continued_move: false,
                  selected_piece: null, winner: null };
  }

  //React update method
  componentDidUpdate(prevProps, prevState) {
    //this.state.board.update_board();
    if (prevState.turn !== this.state.turn) {
      let board = this.state.board;
      if (!board.moves_left(this.state.turn)) {
        console.log("${this.state.turn} has no more moves!");
        this.setState({winner: this.next_player()});
      }
    } else {
      //if is a move continuation, start the timer
    }
  }

  select_cell(row, col) {
    //If a move is not a continuation, default case,
    if (!this.state.continued_move) {
      if (this.can_select_piece(row, col)) this.set_piece(row, col);
      else if (this.state.selected_piece)  this.handle_move(row, col);
    } else { //if continuation
      //check if move = true..
      let board = this.state.board;
      if (board.valid_move(row, col)) this.handle_move(row, col)
      else {
        //TODO: prompt "end turn?" option.
        //right now, let's just end the turn otherwise
        this.setState({board: board, turn: this.next_player(this.state.turn), continued_move: false, selected_piece: null});
        board.update_board();
      }
    }
  }

  handle_move(row, col) { //row, col of destination
    let board = this.state.board;
    if (!board.valid_move(row, col)) {
      console.log("Invalid move!");
      return;
    }
    console.log("handling move...");
    let sel = this.state.selected_piece;
    let pi = board.board[sel.row][sel.col].who;

    let move_direction;
    //Check if move is a clone move; If it is, we need not call do_move
    if(board.is_clone_spawn(pi,row, col)) board.make_clone(pi, row, col);
    else move_direction = board.do_move(pi, row, col);
    board.update_board();
    //all highlights gone

    //If we can jump or leap, or phase (if move prior was not a phase)
    if (board.can_continue_move(pi, move_direction)) {
      board.get_moves(pi, 3, move_direction.row_incr, move_direction.col_incr); //highlight continuable moves
      this.setState( {board: board, turn: this.state.turn, continued_move: move_direction, selected_piece: {row: row, col: col}});
    } else this.setState({board: board, turn: this.next_player(this.state.turn), continued_move: false, selected_piece: null});
  }

  can_select_piece(row, col) {
    let s = this.state;
    let cell = s.board.board[row][col].who;
    if (cell === null) return false;
    let player = s.board.pieces[cell].player;
    return player === s.turn;
  }

  set_piece(row, col) {
    let board = this.state.board;
    board.update_board();
    board.get_moves(board.board[row][col].who);
    this.setState({selected_piece: {row: row, col: col}});
      //console.log("selected piece: " + this.state.board.board[row][col].who);
  }

  next_player() {
    return (this.state.turn === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE);
  }

  restart() {
    this.setState({ board: new Board(BOARD_SIZE, PLAYER_ONE, PLAYER_TWO),
                    continued_move: false, turn: PLAYER_ONE,
                    selected_piece: null, winner: null });
  }

  render() {
    return (
      <div className="Leap">
        <div className="Leap-header">
          <h2>Leap</h2>
        </div>
        { this.state.winner && <Winner player={this.state.winner} restart={this.restart.bind(this)} /> }
        <h3>Current turn: {PLAYERS[this.state.turn].name}<span className={PLAYERS[this.state.turn].class+"-token"}></span></h3>


        <div className="game-container">
          <div className="game-options"></div>
          <GameBoard board={this.state.board}
                     selected_piece={this.state.selected_piece}
                     select_cell={this.select_cell.bind(this)} />
          <div className="game-menu"></div>
        </div>
      </div>
    );
  }
}
/*
<Countdown date={Date.now() + 10000}
           intervalDelay={0}
           precision={3}
           autoStart={this.state.continued_move}
           renderer={d => <div>
              <span className="countdown-s">{d.seconds}</span>
              <span className="countdown-ms">:{d.milliseconds}</span>
           </div>}/>
*/


function Winner(props) {
  let player = PLAYERS[props.player].name;
  return (
    <div id="winner">
      <div>
        <p>{player} has won the game!</p>
        <button onClick={props.restart}>Play again?</button>
      </div>
    </div>
  );
}

class GameBoard extends Component {
  render() {
    let selected_row = this.props.selected_piece ? this.props.selected_piece.row : null;
    let rows = this.props.board.board.map((row, i) => {
      return <Row key={i}
              board={this.props.board}
              row={row} //board[row]
              selected_piece={i === selected_row ? this.props.selected_piece : null}
              row_i={i}
              pieces={this.props.board.pieces}
              select_cell={this.props.select_cell} />;
    });
    return (<div className="board"> {rows} </div>)
  }
}

class Row extends Component {
  render() {
    let selected_col = this.props.selected_piece ? this.props.selected_piece.col : null;
    let cells = this.props.row.map((cell, i) => {
      return <Cell key={i}
              val={cell.who} //so this.board[row][col] = {who: p.player | null, highlight: true | false -> if selected_col then this.board[row][col].highlight
              board={this.props.board}
              row={this.props.row_i}
              column={i}
              highlight={cell.move ? true : false}
              selected={i === selected_col ? true : false}
              select_cell={this.props.select_cell} />
    });
    return (<span className="row"> {cells} </span>)
  }
}

class Cell extends Component {

  render() {
    let color = CELL_COLORS[util.cell_type(this.props.row, this.props.column)];

    //let selection = this.props.selected ? " selected" : "";
    let highlight = this.props.highlight ? " highlight" : "";
    let classes = "cell " + color + highlight;
    return (
      <div className={classes} onClick={ () => this.props.select_cell(this.props.row, this.props.column) }>
        {this.props.val !== null && <Piece piece={this.props.val} board={this.props.board} selected={this.props.selected ? true : false}/>}
      </div>
    )
  }
}

function Piece(props) {
  //console.log(props.piece);
  let classes = "";
  let p = props.board.pieces[props.piece];
  if (props.piece !== null) {
    classes += PLAYERS[p.player].class;
    if (p.cloned) classes += " cloned";
    if (props.selected) {
      classes += " selected";
      //props.board.get_moves(props.piece);
    }
  }
  return (<div className={classes}></div>)
}

export default Leap;
