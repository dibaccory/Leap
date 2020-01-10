import React, { Component } from 'react';
import './css/ui.css';
import Countdown from 'react-countdown-now';
import {cellType} from './js/util.js';
import Board from './js/board.js';

/*
TODO:
highlight pieces

Game description:


"How to Play":
-directions
-tutorial?
*/

export var BOARD_SIZE;
//const BOARD_AREA = BOARD_SIZE*BOARD_SIZE;
const playerOne = 4;
const playerTwo = 12;
var PLAYERS;

const CELL_COLORS = [ "gray1", "gray2", "pink", "red", "orange", "yellow", "green", "blue"];

class Leap extends Component {
  constructor(props) {
    super(props);
    BOARD_SIZE = props.config.size;
    const player = props.config.players[0].first ? playerOne : playerTwo
    this.state = {
      /*...props.config,*/
      board: new Board(player, BOARD_SIZE, 0), // 0 is phaseLayout
      turn: player,
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
/*
  componentDidUpdate(prevProps, prevState, snapshot) {

    //check if current player is bot
    if(PLAYERS[this.state.turn].bot) {
      console.log('BOT TIME: ');

    }
  }
  */

  //React update method
  componentDidUpdate(prevProps, prevState) {
    //this.state.board.highlightPieceMoves();
    if (prevState.turn !== this.state.turn) {
      let board = this.state.board;
      if (!board.movesLeft(this.state.turn)) {
        console.log("${this.state.turn} has no more moves!");
        this.setState({winner: this.switchPlayer()});
      }
    } else if (this.state.selectedPiece){
      //HIGHLIGHT MOVES
      //if is a move continuation and Counter hasn't started, start the timer
      //if (this.state.contined_move) {}
    }
  }

  selectCell(cell, index) {
    //If a move is not a continuation, default case,
    if (!this.state.continuedMove) {
      if (this.canSelectPiece(cell)) this.setPiece(cell, index);
      else if (this.state.selectedPiece !== null)  this.handleMove(cell, index);
    } else { //if continuation
      //check if move = true..
      let board = this.state.board;
      if (cell & 2) this.handleMove(cell, index);
      else {
        board.removeHighlight();
        //TODO: prompt "end turn?" option.
        //right now, let's just end the turn otherwise
        this.setState({
          board: board,
          turn: board.switchPlayer(),
          continuedMove: false,
          selectedPiece: null
        });
      }
    }
  }

  handleMove(cell, to) {
    let board = this.state.board;
    let pi = board.board[this.state.selectedPiece] >> 5;

    //Have shake animation effect on piece.
    if (!board.validMove(pi, to)) {
      console.log("Invalid move!");
      return;
    }
    console.log("handling move...");

    let canContinue = board.doMove(this.state.selectedPiece, to);

    //If we can jump or leap, or phase
    if (canContinue) {
      //board.getMoves(to, 3, continuedDirection);
      board.highlightMoves(pi);
      this.setState({
        board: board,
        turn: board.player,
        continuedMove: true,
        selectedPiece: to
      });
    } else this.setState({
        board: board,
        turn: board.player,
        continuedMove: false,
        selectedPiece: null
      });
  }

  canSelectPiece(cell) {
    //true if cell contains current player's piece AND current player isn't a bot
    return (cell & 4) && ( (cell & 12) === this.state.turn ) && !PLAYERS[this.state.turn].bot;
  }

  setPiece(cell, index) {
    let board = this.state.board, pi = cell >> 5;
    board.removeHighlight();
    board.clearMoves(pi);
    board.getMoves(index);
    board.highlightMoves(pi);
    this.setState({selectedPiece: index});
      //console.log("selected piece: " + this.state.board.board[row][col].who);
  }

  restart() {
    this.setState({ board: new Board(BOARD_SIZE, playerOne, playerTwo),
                    continuedMove: false, turn: playerOne, //TODO
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
  //let selectedRow = props.selectedPiece ? props.selectedPiece.row : null;

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
      continuedDirection,
      captured piece (if applicable)

  Upon doMove or makeClone:
  - Find Cell components of startingCell and, if applicable, captured piece
      (starting cell) get Cell component c such that: c.row === startingCell.row && c.col === startingCell.col
      (captured piece) get

  -


*/
export default Leap;
