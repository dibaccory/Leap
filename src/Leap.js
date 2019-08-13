import React, { Component } from 'react';
import './css/ui.css';
import './js/board.js';

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

class Leap extends Component {{
  constructor() {
    super();
    this.state = { board: new Board(BOARD_SIZE, PLAYER_ONE, PLAYER_TWO),
                  turn: PLAYER_ONE,
                  selected_cell: null, winner: null };

  }

  select_cell(row, column) {
    console.log("in select square for row "+row+" column "+column);
    let selected = this.state.selected_cell;
    if (this.can_select_cell(row, column)) {
      this.setSquare(row, column);
    } else if (selected) {
      this.handleMove(row, column);
    }
  }

  handleMove(row, col) {
    console.log("handling move...");
    let board = this.state.board;
    let selected = this.state.selected_cell;
    let start = board.board[selected.row][selected.column];
    if (!board.canMoveChecker(start, row, col)) {
      console.log("illegal move");
      return;
    }

    let isJump = board.isJumpMove(start, row, col);
    let becameKing = false;
    board.moveChecker(start, row, col);
    if (!board.isKing(start) && (board.getPlayer(start) == PLAYER_ONE && row == 0)
    || (board.getPlayer(start) == PLAYER_TWO && row == ((board.board.length)-1))) {
      console.log("making King....");
      becameKing = true;
      board.makeKing(start);
    }

    if (!becameKing && isJump && board.canKeepJumping(start)) {
      this.setState({board: board, selected_cell: {row: row, column: col}});
    } else {
      this.setState({board: board, turn: this.nextPlayer(), selected_cell: null});
    }
  }

  can_select_cell(row, column) {
    let square = this.state.board.board[row][column];
    if (!square) {
      return false;
    }
    let player = this.state.board.checkers[square].player;
    return player == this.state.turn;
  }

  setSquare(row, column) {
    this.setState({selected_cell: {row: row, column: column}});
  }

  nextPlayer() {
    return (this.state.turn == PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE)
  }

  restart() {
    this.setState({ board: new Board(BOARD_SIZE, PLAYER_ONE, PLAYER_TWO),
                  turn: PLAYER_ONE, selected_cell: null, winner: null });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>React Checkers</h2>
        </div>
        {this.state.winner &&
          <Winner player={this.state.winner} restart={this.restart.bind(this)} />
        }
        <h3>Current turn: {PLAYERS[this.state.turn].name}<span className={PLAYERS[this.state.turn].class}></span></h3>
        <GameBoard board={this.state.board}
        selected_cell={this.state.selected_cell}
        select_cell={this.select_cell.bind(this)} />
      </div>
    );
  }
}


class Row extends Component {
  render() {
    let selectedCol = this.props.selectedSquare ? this.props.selectedSquare.column : null;
    let squares = this.props.row.map((square, i) => {
      return <Square key={i}
              val={square != null ? this.props.checkers[square] : null}
              row={this.props.rowNum}
              column={i}
              selected={i == selectedCol ? true : false}
              selectSquare={this.props.selectSquare} />
    });
    return (
      <div className="row">
        {squares}
      </div>
    )
  }
}

class Square extends Component {
  render() {
    /*
  	(row == 1 && col == 2) || (row == 6 && col == 5) pink
  	(row == 3 && col == 2) || (row == 4 && col == 5) red
  	(row == 4 && col == 2) || (row == 3 && col == 5) orange
  	(row == 5 && col == 3) || (row == 2 && col == 4) yellow
  	(row == 5 && col == 4) || (row == 2 && col == 3) green
  	(row == 6 && col == 2) || (row == 1 && col == 5) blue
  	*/
    let color = (this.props.row + this.props.column) % 2 == 0 ? "red" : "black";
    let selection = this.props.selected ? " selected" : "";
    let classes = "square " + color + selection;
    return (
      <div className={classes} onClick={() => this.props.selectSquare(this.props.row, this.props.column)}>
        {this.props.val != null &&
          <Piece checker={this.props.val} />
        }
      </div>
    )
  }
}

function Piece(props) {
  console.log(props.checker);
  let classes = "";
  if (props.checker) {
    classes += PLAYERS[props.checker.player].class;
    if (props.checker.isKing) {
      classes += " king";
    }
  }
  return (
    <div className={classes}></div>
  )
}

export default Leap;
