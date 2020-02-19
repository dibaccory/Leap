import GAME from '../constants/game.types';

const initialState = {
  game: null,
  move: {to: undefined, from: undefined, captured: undefined},
  readyToMove: false,
  endOfTurn: false,
};


function gameReducer (state = initialState, action) {
  const { game, move } = state;
  switch (action.type) {
    case GAME.START:

      break;
    case GAME.SELECT:
      //selectcell logic in here... when submiting move, confirm on server
      const { cell, index } = action;
      const possibleMoveTo = (cell & 2);

      if (game.continuedMove) { //implies current user is moving
        return (possibleMoveTo)
          ? { ...state, move: {to: index, from: move.from, captured: game.getCapturedPiece(move.from >> 5, to)} };   //update
          : { ...state, }
      } else {
        const pieceType = cell & (8 | 10 | 12);
        if (pieceType) {  //if piece
          const isSelectablePiece = !(pieceType ^ user.value) || pieceType === 10;
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
      ;

    default: return state;
  }
}
