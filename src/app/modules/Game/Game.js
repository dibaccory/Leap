import React from 'react';
import { connect } from 'react-redux';
import { select, moveReady, cacheMove } from './actions';
import { number, object } from 'prop-types';
import { getUserPlaymode } from '../selectors';
import { bindActionCreators } from 'redux';
import Cell from './Cell';
import './styles.css';


export class Game extends React.Component {
  constructor ({ game, player, move, cacheMove, moveReady}) {
    super();
    this.state = {
      game: game,
      player: player,
      move: move,
      continuedMove: false,
    }
  }

  componentDidMount () {
    const { game, player } = this.state;
    if (game.turn === player) {
      if (!game.getAllMoves(game.turn)) {
        console.log(`${game.turn} has no more moves!`);
        this.endTurn(true);
      }
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { game, player } = this.state;
    if (game.turn === player) {
      if (!game.getAllMoves(game.turn)) {
        console.log(`${game.turn} has no more moves!`);
        this.endTurn(true);
      }
    }
  }

  selectCell (cell, index) { //call implies it's this user's turn
    const { game, player } = this.state;
    const highlighted = (cell & 2);

    if (game.continuedMove) { //implies current user is moving
      if (highlighted) this.setDestination(index);
      else {
        //TODO: prompt "end turn?" option
        game.switchPlayer(); //sketchy
        this.endTurn();
      }
    } else {
      const pieceType = cell & (4 | 8 | 12);
      if (pieceType) {  //if piece
        const canSelectPiece = !(pieceType ^ player) || pieceType === 8;
        const hasMoves = game.moves[cell >> 5].length > 0;

        if (canSelectPiece && hasMoves) this.setPiece(cell, index);
        else try {
          if (!canSelectPiece) throw 'OPPONENT PIECE';
          if (!hasMoves) throw 'PIECE HAS NO MOVES';
        } catch (error) {
          console.log(`CANNOT SELECT: ${error}`);
        }
      }
      else {  //if empty cell
        if (cell & 2) this.setDestination(index);
        else console.log('CANNOT SELECT: NOT EMPTY');
      }
  }
}

setPiece (cell, index) {
  const { game } = this.state;
  const pi = cell >> 5;
  game.removeHighlight();
  game.highlightMoves(pi);
  const move = {from: index, to: undefined, captured: undefined};
  this.setState({ move: move });
  //cacheMove(move);
}

setDestination (to) {
  this.setState({ move: {from: this.state.move.from, to: to, captured: this.state.game.getCapturedPiece(to)} });
  moveReady();
}
/*
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
*/

render () {
  const { game, move } = this.state;
  const { BOARD_AREA } = game.getConfig();
  /*  display: grid for the cells  */
  let cells = [];
  for (let index = 0; index < BOARD_AREA; index++) {
    const cell = game.board[index];
    const moveType = (move.to === index && 'to')
     || (move.from === index && 'from')
     || (move.captured === index && 'captured')
     || '';

    cells.push(<Cell
      key={index}
      index={index}
      cell={cell}
      highlight={cell & 2}
      moveType={moveType}
      select={this.selectCell.bind(this)} />);
  }
  return (<div className="board"> { cells } </div>);
};

}

Game.propTypes = {
  game: object.isRequired,
  player: number.isRequired,
  ///move: object
};

const mapStateToProps = state => ({
  player: getUserPlaymode(state),
  //move: getMoveSelections(state)
});

const actions = {
  cacheMove,
  moveReady,
};

export default connect(mapStateToProps, dispatch => bindActionCreators(actions ,dispatch))(Game);
