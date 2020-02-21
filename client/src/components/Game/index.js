import React, {useEffect, useState} from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { select } from '../../actions/game';
import Cell from '../Cell';

export class Game extends React.Component {
  constructor ({ game }) {
    super();
    const player = 4;
    this.state = {
      game: game,
      player: player,
      move: {to: undefined, from: undefined, captured: undefined},
      continuedMove: false,
    }
  }

  componentDidUpdate (prevProps, prevState) {
    /*
    THIS SHOULD BE HANDLED IN SERVER
    const { game, player } = this.state;
    if (game.turn === player) {
      if (!game.getAllMoves(game.turn)) {
        console.log(`${game.turn} has no more moves!`);
        this.endTurn(true);
      }
    }
    */
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
      const pieceType = cell & (8 | 10 | 12);
      if (pieceType) {  //if piece
        const canSelectPiece = !(pieceType ^ player) || pieceType === 10;
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
  this.setState({ move: {from: index, to: undefined, captured: undefined} });
}

setDestination (to) {
  this.setState({ move: {from: this.state.move.from, to: to, captured: this.state.game.getCapturedPiece(to)} });
}

render () {
  const { game, move } = this.state;
  /*  display: grid for the cells  */
  let cells = [];
  for (let index = 0; index < game.board.length; index++) {
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
      select={select.bind(this)} />);
  }
  return (<div className="board"> { cells } </div>);
};

}

//Game.propTypes = { game: object.isRequired, move: object };
//TODO: make selectors
//const mapStateToProps = state => ({move: getMoveSelections(state)});

export default connect(/*mapStateToProps*/)(Game);
