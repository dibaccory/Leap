import React, { Component } from 'react';
import './css/ui.css';
import Countdown from 'react-countdown-now';
import {cellType} from './js/util.js';
import Board from './js/board.js';
import {UCT as Bot} from './js/ai.js';
import * as Colyseus from 'colyseus.js';

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
    this.firstPlayer = props.config.players[0].first ? playerOne : playerTwo
    this.state = {
      /*...props.config,*/
      board: new Board(this.firstPlayer, BOARD_SIZE, 0), // 0 is phaseLayout
      turn: this.firstPlayer,
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

    //if true at this point, then port has been established
    if (props.config.online) {
      // use current hostname/port as colyseus server endpoint
      var endpoint = window.location.protocol.replace("http", "ws") + "//" + window.location.hostname;

      // development server
      if (window.location.port && window.location.port !== "80") endpoint += ":${ props.config.port }";

      this.send = new CustomEvent('move');
      this.colyseus = new Colyseus(endpoint);
      this.gameHandler = this.colyseus.join('game', { channel: window.location.hash || "#default" });
      this.gameHandler.on('move', this.onUpdateRemote.bind(this));

    }
  }

  onUpdateRemote (newState) {
    console.log("new state: ", newState);
    this.setState(newState);
  }

  componentDidMount() {
    //Check if first player is bot
    if(PLAYERS[this.state.turn].bot) {
      var ai = Bot(this.state.board, 5000);
      this.handleMove(ai.from, ai.to);
    } else this.state.board.getAllMoves(this.state.turn);
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
      if (!board.getAllMoves(this.state.turn)) {
        console.log("${this.state.turn} has no more moves!");
        this.setState({winner: board.switchPlayer()});
      }

      if (PLAYERS[this.state.turn].bot) setTimeout ( () => this.botMove(), 200 );

    } else if (this.state.selectedPiece){
      //HIGHLIGHT MOVES
      //if is a move continuation and Counter hasn't started, start the timer
      //if (this.state.contined_move) {}
    }
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
        this.setState({
          board: board,
          turn: board.switchPlayer(),
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
    console.log("handling move...");
    //debugger;

    //check if win
    if(board.doMove(from, to)) {
      this.setState({winner: board.switchPlayer()});
      return;
    }

    //If we can jump or leap, or phase
    if (board.continuedMove) {
      board.highlightMoves(pi);
      this.setState({
        board: board,
        turn: board.player,
        continuedMove: board.continuedMove,
        selectedPiece: to
      });
    } else this.setState({
        board: board,
        turn: board.player,
        continuedMove: false,
        selectedPiece: null
      });

    //If multiplayer, send board
    if(this.send !== undefined) this.dispatchEvent(this.send);
  }

  canSelectPiece(cell) {
    //true if cell contains current player's piece AND current player isn't a bot
    return (cell & 4) && ( (cell & 12) === this.state.turn ) && !PLAYERS[this.state.turn].bot;
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
Game description

"How to Play":
-directions
-tutorial?

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
*/
export default Leap;
