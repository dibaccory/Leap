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

const CELL_COLORS = [ "gray1", "gray2", "pink", "red", "orange", "yellow", "green", "blue"];

class Leap extends Component {{
  constructor() {
    super();
    this.state = { board: new Board(BOARD_SIZE, PLAYER_ONE, PLAYER_TWO),
                  turn: PLAYER_ONE,
                  selected_piece: null, winner: null };
  }

  select_cell(row, col) {
    console.log("in select cell for row "+row+" column "+col);
    if (this.can_select_piece(row, col)) {
      this.set_piece(row, col);
    } else if (this.state.selected_piece) {
      this.handle_move(row, col);
    }
  }

  handle_move(row, col) {

    console.log("handling move...");
    let board = this.state.board;
    let piece = this.state.selected_piece;
    //let start = board.board[selected.row][selected.column];
    if (!board.can_move(piece, row, col)) {
      console.log("illegal move");
      return;
    }

    //TODO: check if can clone, or continue move (jump, leap, clone, or switch)

  }

  can_select_piece(row, col) {
    let cell = this.state.board.board[row][col];
    if (!cell) return false;
    let player = this.state.board.pieces[cell].player;
    return player == this.state.turn;
  }

  set_piece(cell) {
    this.setState({selected_piece: this.state.board.pieces[cell]});
  }

  next_player() {
    return (this.state.turn == PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE)
  }

  restart() {
    this.setState({ board: new Board(BOARD_SIZE, PLAYER_ONE, PLAYER_TWO),
                  turn: PLAYER_ONE, selected_piece: null, winner: null });
  }

  render() {
    return (
      <div className="Leap">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Leap</h2>
        </div>
        {this.state.winner &&
          <Winner player={this.state.winner} restart={this.restart.bind(this)} />
        }
        <h3>Current turn: {PLAYERS[this.state.turn].name}<span className={PLAYERS[this.state.turn].class}></span></h3>
        <GameBoard board={this.state.board}
        selected_piece={this.state.selected_piece}
        select_cell={this.select_cell.bind(this)} />
      </div>
    );
  }
}


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
              row={row}
              selected_piece={i == selected_row ? this.props.selected_piece : null}
              row_i={i}
              pieces={this.props.board.pieces}
              select_cell={this.props.select_cell} />;
    });
    return (
      <div className="board">
        {rows}
      </div>
    )
  }
}

class Row extends Component {
  render() {
    let selected_col = this.props.selected_piece ? this.props.selected_piece.column : null;
    let cells = this.props.row.map((cell, i) => {
      return <Cell key={i}
              val={cell ? this.props.pieces[cell] : null}
              row={this.props.row_i}
              column={i}
              selected={i == selected_col ? true : false}
              select_cell={this.props.select_cell} />
    });
    return (
      <div className="row">
        {cells}
      </div>
    )
  }
}

class Cell extends Component {
  render() {
    let color = CELL_COLORS[cell_type(this.props.row, this.props.column)];

    let selection = this.props.selected ? " selected" : "";
    let classes = "cell " + color + selection;
    return (
      <div className={classes} onClick={() => this.props.select_cell(this.props.row, this.props.column)}>
        {this.props.val != null &&
          <Piece piece={this.props.val} />
        }
      </div>
    )
  }
}

function Piece(props) {
  console.log(props.piece);
  let classes = "";
  if (props.piece) {
    classes += PLAYERS[props.piece.player].class;
    if (props.piece.is_clone) {
      classes += " king";
    }
  }
  return (
    <div className={classes}></div>
  )
}

export default Leap;
