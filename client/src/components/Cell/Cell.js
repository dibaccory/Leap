import React from 'react';
import './Cell.css';
import {cellType, CELL_COLORS} from './util.js';

export const Cell = ({ cell, index, moveType, highlight, select }) => {
  const color = CELL_COLORS[cellType(index)];
  const status =  moveType || (highlight ? 'possible' : '');
  const classes = `cell ${color} ${(status ? 'move-'+status : '')}`;

  return (
    <div className={classes} onClick={ () => select(cell, index) }>
      { ((cell & 12) > 0) && <Piece
        key={cell >> 5}
        player={cell & 12}
        cloned={(cell & 16) === 1} />}
    </div>
  );
}

const Piece = (props) => {
  const { player, cloned } = props;
  console.log(player);
  const pieceColor = (player === 4 && 'white') || (player === 12 && 'black') || 'superposed';
  const classes = `piece ${(cloned && 'cloned') || ''} ${pieceColor}`;
  return (<div className={classes} ></div>);
}

export default Cell;
