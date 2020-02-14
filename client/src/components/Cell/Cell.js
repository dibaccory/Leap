function Cell(props) {
  const { cell, index, selected } = props;
  const color = CELL_COLORS[cellType(index)];
  const status = selected || (highlight ? 'possible' : '');
  const classes = `cell ${color} ${(status ? 'move-'+status : '')}`;

  return (
    <div className={classes} onClick={ () => props.select(cell, index) }>
      { ((cell & 12) > 0) && <Piece
        key={cell >> 5}
        player={cell & 12}
        cloned={(cell >> 4) & 16}
        selected={selected} />}
    </div>
  );
}

function Piece(props) {
  const {...props} = props;
  const pieceColor = (player === 8 && 'white') || (player === 12 && 'black') || 'superposed';
  const classes = `piece ${cloned && 'cloned'} ${pieceColor}`;
  return (<div className={classes} ></div>);
}