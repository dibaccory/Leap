import React, {useEffect, useState} from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { select } from '../../actions/game';
// this.state = {
//   game: props.game,
//   user: props.user, //value, isBot, color
//   move: { from: undefined, to: undefined, captured: undefined},
// }
  //const isTurn = user.value === game.turn;

export const Game = ({ game, move }) => {
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

Game.propTypes = { game: object.isRequired, move: object.isRequired };
//TODO: make selectors
const mapStateToProps = state => ({move: getMoveSelections(state)});

export default connect(mapStateToProps)(Game);
