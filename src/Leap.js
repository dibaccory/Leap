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
*/

const BOARD_SIZE = 8;
const BOARD_AREA = BOARD_SIZE*BOARD_SIZE;
const playerOne = 1;
const playerTwo = 2;
var PLAYERS;

const CELL_COLORS = [ "gray1", "gray2", "pink", "red", "orange", "yellow", "green", "blue"];

class Leap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /*...props.config,*/
      board: new Board(BOARD_SIZE, 0), // 0 is phaseLayout
      turn: props.config.players[0].first ? playerOne : playerTwo,
      continuedMove: false,
      selectedPiece: null,
      winner: null
    };

    /*
    When we implement colyseus,
      name: 'Player X' default, change in 'more' section or something
      class: 'piece '+ chosen color
      bot: true | false
    */
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

  componentDidMount() {
    //Check if first player is bot
    if(PLAYERS[this.state.turn].bot) {
      console.log('tete');
    }
  }

//GOOD PLACE FOR NETWORK REQUEST
  componentDidUpdate(prevProps, prevState, snapshot) {

    //check if current player is bot
    if(PLAYERS[this.state.turn].bot) {
      console.log('BOT TIME: ');

    }
  }

  //React update method
  componentDidUpdate(prevProps, prevState) {
    //this.state.board.updateBoard();
    if (prevState.turn !== this.state.turn) {
      let board = this.state.board;
      if (!board.movesLeft(this.state.turn)) {
        console.log("${this.state.turn} has no more moves!");
        this.setState({winner: this.nextPlayer()});
      }
    } else if (this.state.selectedPiece){
      //if is a move continuation and Counter hasn't started, start the timer
      //if (this.state.contined_move) {}
    }
  }

  selectCell(row, col) {
    //If a move is not a continuation, default case,
    if (!this.state.continuedMove) {
      if (this.canSelectPiece(row, col)) this.setPiece(row, col);
      else if (this.state.selectedPiece)  this.handleMove(row, col);
    } else { //if continuation
      //check if move = true..
      let board = this.state.board;
      if (board.validMove(row, col)) this.handleMove(row, col)
      else {
        //TODO: prompt "end turn?" option.
        //right now, let's just end the turn otherwise
        this.setState({
          board: board,
          turn: this.nextPlayer(this.state.turn),
          continuedMove: false,
          selectedPiece: null
        });
        board.updateBoard();
      }
    }
  }

  handleMove(row, col) { //row, col of destination
    let board = this.state.board;
    if (!board.validMove(row, col)) {
      console.log("Invalid move!");
      return;
    }
    console.log("handling move...");
    let sel = this.state.selectedPiece;
    let pi = board.board[sel.row][sel.col].who;

    let moveDirection;
    //Check if move is a clone move; If it is, we need not call doMove
    if(board.isCloneSpawn(pi,row, col)) board.makeClone(pi, row, col);
    else moveDirection = board.doMove(pi, row, col);
    //all highlights gone

    //If we can jump or leap, or phase (if move prior was not a phase)
    if (board.canContinueMove(pi, moveDirection)) {
      board.getMoves(pi, 3, moveDirection.rowIncr, moveDirection.colIncr); //highlight continuable moves
      this.setState({
        board: board,
        turn: this.state.turn,
        continuedMove: moveDirection,
        selectedPiece: {row: row, col: col}
      });
    } else this.setState({
        board: board,
        turn: this.nextPlayer(this.state.turn),
        continuedMove: false,
        selectedPiece: null
      });
  }

  canSelectPiece(row, col) {
    let s = this.state;
    let cell = s.board.board[row][col].who;
    if (cell === null) return false;
    let player = s.board.pieces[cell].player;
    return player === s.turn && !PLAYERS[s.turn].bot;
  }

  setPiece(row, col) {
    let board = this.state.board;
    board.updateBoard();
    board.getMoves(board.board[row][col].who);
    this.setState({selectedPiece: {row: row, col: col}});
      //console.log("selected piece: " + this.state.board.board[row][col].who);
  }

  nextPlayer() {
    return (this.state.turn === playerOne ? playerTwo : playerOne);
  }

  restart() {
    this.setState({ board: new Board(BOARD_SIZE, playerOne, playerTwo),
                    continuedMove: false, turn: playerOne,
                    selectedPiece: null, winner: null });
  }

  render() {
    return (
      <div className="Leap">
        { this.state.winner && <Winner player={this.state.winner} restart={this.restart.bind(this)} /> }
        <h3>
          Current turn: {PLAYERS[this.state.turn].name}
          <span className={PLAYERS[this.state.turn].class+"-token"}></span>
        </h3>
        <div className="game-container">
          <div className="game-options"></div>
          <GameBoard board={this.state.board}
                     selectedPiece={this.state.selectedPiece}
                     selectCell={this.selectCell.bind(this)} />
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
           autoStart={this.state.continuedMove}
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


function GameBoard(props) {
  let selectedRow = props.selectedPiece ? props.selectedPiece.row : null;

  let rows = [];
  for(let r=0; r<BOARD_SIZE; r++) {
    rows.push(<Row
      key={r}
      board={props.board}
      selectedPiece={r === selectedRow ? props.selectedPiece : null}
      selectCell={props.selectCell} />);
  }
  return (<div className="board"> {rows} </div>);
}

function Row(props) {
  let selectedCol = props.selectedPiece ? props.selectedPiece.col : null;
  let cells = [], index, pKey;
  for(let c=0; c< BOARD_SIZE; c++) {
    index = (props.key*BOARD_SIZE << 4) | c;
    pKey = rops.board[index] >> 4;
    cells.push(<Cell
      key={index}
      val={pKey} //piece index key
      board={props.board}
      row={props.board[props.board.area]}
      column={i}
      highlight={cell.move !== false ? true : false}
      selected={i === selectedCol ? true : false}
      selectCell={props.selectCell} />
  });
  return (<span className="row"> {cells} </span>);
}

function Cell(props) {
  let color = CELL_COLORS[util.cellType(props.row, props.column)];
  let highlight = props.highlight ? " highlight" : "";
  let classes = "cell " + color + highlight;
  return (
    <div className={classes} onClick={ () => props.selectCell(props.row, props.column) }>
      {props.val !== null
      && <Piece piece={props.val}
                board={props.board}
                selected={props.selected ? true : false}/>}
    </div>
  );
}

function Piece(props) {
  let classes = "";
  let p = props.board.pieces[props.piece];
  if (props.piece !== null) {
    classes += PLAYERS[p.player].class;
    if (p.cloned) classes += " cloned";
    if (props.selected) {
      classes += " selected";
      //props.board.getMoves(props.piece);
    }
  }
  return (<div className={classes}></div>)
}



/*
TODO:
- Make continue button (?)

- AI player

- Allow multiplayer
    Random match making
    invites (link or username (if integrated with Google Play))

- Pieces are draggable and snap to grid
    (if center of dragging piece is strictly within calc(cell-margin + cell-height/2) on drop, then select cell where piece dropped)
    disable animations for all but phase and clone moves.

- Make animations
    If clone, we animate the original piece and newly created piece with cloning animation
    If phase, piece fades in/out from center to edges on adj phase  and on far phase
    if piece has caught:
      If jump,
        piece does a small hop to the destinationCell
        captured bursts into little circles and fades away
      If leap,
        piece gets sucked into portal, (SVG points all transform to center of adj phase, timing ease-in-out), and pushed out (reverse animation)
        if captured on adj phase:
          captured shakes and does first part of phase animation while piece being sucked in, but then comes out as little circles on other side
        else:
          captured bursts into little circles and fades away
    else:
      piece does small hop to destination cell

How can we handle animations?
> Translate moving piece p, where p is a child of the destination cell component,
> from ( startingCell.center.x , startingCell.center.y ) to ( destinationCell.x, destinationCell.y)


ANIMATION PIPELINE:
  In function Board.doMove:
  - get move details
      moving piece: p,
      startingCell = {who: board[p.row][p.col].who, move_type: ye, row: p.row, col: p.col}, -- defined first in do move
      moveDirection,
      captured piece (if applicable)

  Upon doMove or makeClone:
  - Find Cell components of startingCell and, if applicable, captured piece
      (starting cell) get Cell component c such that: c.row === startingCell.row && c.col === startingCell.col
      (captured piece) get

  -


*/

export default Leap;
