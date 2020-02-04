import React from 'react';
import {cellType, CELL_COLORS} from '.././assets/util.js';
var BOARD_SIZE;
var PLAYERS;
export function GameBoard(props) {
  //let selectedRow = props.selectedPiece ? props.selectedPiece.row : null;
  BOARD_SIZE = props.size;
  PLAYERS = props.players;
  let rows = [];
  for(let r=0; r<BOARD_SIZE; r++) {
    rows.push(<Row
      key={r}
      row={r}
      board={props.board}
      selectedPiece={props.selectedPiece}
      selectCell={props.selectCell} />);
  }
  return (<div className="board"> {rows} </div>);
}

function Row(props) {
  let cells = [], index, cell;
  for(let c=0; c< BOARD_SIZE; c++) {
    index = props.row*BOARD_SIZE + c;
    cell = props.board.board[index];
    cells.push(<Cell
      key={index} //board index
      index={index}
      val={cell} //cell info
      row={props.row}
      col={c}
      highlight={props.board.board[index] & 2}
      selected={index === props.selectedPiece}
      selectCell={props.selectCell} />);
  }
  return (<span className="row"> {cells} </span>);
}

function Cell(props) {
  let color = CELL_COLORS[cellType(props.row, props.col)];
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

function Piece(p) {
  let classes = "";
  classes += PLAYERS[p.player].class;
  if (p.cloned) classes += " cloned";
  if (p.selected) {
    classes += " selected";
  }
  return (<div className={classes}></div>)
}

export default GameBoard;
