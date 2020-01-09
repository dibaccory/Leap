import {cellType, phaseLayouts} from './util';
/*

REFACTOR CHANGES:
Leap.js -> Game.js
	<Leap> -> <GameController>
board.js -> leap.js


BITWISE:

BOARD:
bit				item
0-1				cellType	{regular, phase} x {highlight, no highlight}
2-3			cellState		{00: empty, 10: SPECIAL, 01: p1, 11: p2, }   NOTE, if '10' for bits 1 and 2, then it should be a SPECIAL THING???  lmao what if a piece can be moved by either player for a few turns?
4					isCloned
5-9				key				If piece on cell, this is index to reach it

board[i] = (key << 4 | isCloned << 3 | cellState << 1 | cellType);
for i = row * SIZE + col 		where row, col wtr a given piece

PIECE INDEX:
bit 			item
0-2				col
3-(5,6)		row

board[i] = (row << 4 | col);
for i = SIZE*SIZE + key			where


how to store moves
moves[i] = [ 0 <= board_index < SIZE*SIZE, ... , ... ] all possible moves for associated piece.
for i = SIZE*SIZE


index = cell number
key = piece index

*/
var BOARD_SIZE, BOARD_AREA, BIT_SIZE, BIT_MAX_PI, BIT_INDEX_SHIFT, BIT_AREA;

function getBitShift(b) {
  return (b >> 1) ? (1 + getBitShift(b >> 1)) : 1;
}


function Board(len, phaseLayout) {

	this.p1 = 4;
	this.p2 = 12;

	BOARD_SIZE = len;
	BOARD_AREA = BOARD_SIZE**2;
	BIT_SIZE = 2**getBitShift(BOARD_SIZE-1);
	BIT_MAX_PI = 2*BIT_SIZE;
	BIT_INDEX_SHIFT = getBitShift(BOARD_AREA-1);
	BIT_AREA = 2**BIT_INDEX_SHIFT;



	(this.board = []).length = BOARD_AREA + 4*len;
	(this.moves = []).length = 4*len;
	this.board.fill(0, 0, BOARD_AREA-1);
	this.bufferSize = 1;	//how many rows between the pieces' starting location and the nearest phases
	this.init(phaseLayout);
	//this.update();
}



Board.prototype.init = function (layout) {
    let pi=0; //piece Index (ID)
		const len = BOARD_SIZE;

		const calcPhases = (index) => {
			let k = 0;
			while(k<phaseLayouts[layout].length) {
				if ( (index^phaseLayouts[layout][k]) === 0 ) return 1;
				k++;
			}
			return 0;
		};
		this.clearMoves();
		for(let i=0; i<len; i++) {
			this.board[i] = ( (pi << 5) | this.p1); //00000 0 01 00
			this.initPiece(pi, i);

			this.board[i + (len-1)*len] = ( (pi + BIT_MAX_PI << 5) | this.p2); //100000 0 11 00
			this.initPiece(pi + BIT_MAX_PI, i + (len-1)*len);


			pi++;

			for(let j=1+this.bufferSize; j<len-1-this.bufferSize; j++) {
				this.board[i + j*len] |= calcPhases(i+j*len);
			}
		}
}

Board.prototype.initPiece = function (key, index) {
	this.board[BOARD_AREA + key] = index;
}

Board.prototype.clearMoves = function (pi) {
	if(pi !== undefined) {
		this.moves[pi] = [];
		return;
	}
	for(let i=0; i<4*BOARD_SIZE; i++) this.moves[i] = [];
}

// moves[pi] = [0000000 0000000] --> [board index of captured piece + board index of destination cell]
Board.prototype.addMove = function (from, to, captured) {
	captured = captured || 0;
	const pi = (this.board[from] >> 5);
	this.moves[pi].push( (captured << (BIT_INDEX_SHIFT) ) + to );
}

Board.prototype.isRedundantMove = function (from, to) {
	const pi = (this.board[from] >> 5);
	const n = this.moves[pi].length;
	for(let i=0; i<n; i++) {
		if ( (this.moves[pi][i] & (BIT_AREA-1)) === to ) return true;
	}
	return false;
}

Board.prototype.getPlayer = function (index) {
	const pid = (this.board[index] & 12);
	switch (pid) {
		case 12:
			return this.p2;
		case 4:
			return this.p1;
		default:
			return 0;
	}
	//return ( (this.board[index] & 12) < 12 ) ? this.p1 : this.p2;
}

Board.prototype.getCapturedPiece = function (pid, to) {
	let nMoves = this.moves[pid].length;
	for(let i=0; i< nMoves; i++) {
		let move = this.moves[pid][i];
		let capturedPiece = move >> (BIT_INDEX_SHIFT);
		if( (move & (BIT_AREA - 1)) === to  && capturedPiece) return capturedPiece;
	}
}

/*==========											CLONE															==========*/

//Assume special tiles won't appear on spawn rows
Board.prototype.makeClone = function (from, to) {
	const player = this.getPlayer(from);
	const c = (player === 12) ? BIT_MAX_PI : 0;
	let key;
	//Find first empty slot
	for(key= BOARD_SIZE+c; key< 2*BOARD_SIZE+c; key++) {
		if(this.board[BOARD_AREA + key] === undefined) {
			this.board[BOARD_AREA + key] = to;
			this.board[to] = (key << 5) | player | 16;
			this.board[from] |= 16;
			break;
		}
	}

}


Board.prototype.onCloningCell = function (from) {
	const onRow = from/BOARD_SIZE, piece = this.board[from];
	const onBoundaryColumn = (from+1)%BOARD_SIZE < 2;
	const onBoundaryRow = (onRow + 1)%BOARD_SIZE < 2;

	//To clone: NOT be on boundary column, BE on boundary row, NOT be cloned yet
	if(onBoundaryColumn || !onBoundaryRow || (piece & 16) ) return false;

	const spawnRow = ( (piece >> 5) & BIT_MAX_PI ) ? (BOARD_SIZE-1) : 0;
	return (onRow ^ spawnRow);
}
//Assumes valid move
Board.prototype.isCloneMove = function (from, to) {
	//if on cloning cell, suffice to show if destination is on spawn row
	const spawnRow = ( (this.board[from] >> 5) & BIT_MAX_PI ) ? (BOARD_SIZE - 1) : 0;
	return this.onCloningCell(from) && (Math.floor(to/BOARD_SIZE) === spawnRow);
}

/*==========											MOVE LOGIC												==========*/

// Board.prototype.getPlayer = function (pi) {
// 	return this.pieces[pi].player;
// }

Board.prototype.canLeap = function (from, adj, bypassCondition) {
	const to = this.getInverseIndex(from);
	if(this.getPlayer(to)) return false;

	const player = this.getPlayer(from);
	const inv = this.getInverseIndex(adj);
	const phaseAdj = this.getPlayer(adj);
	const phaseFar = this.getPlayer(inv);

	if( (phaseAdj ^ phaseFar ^ player === 2) ) {
		if (bypassCondition%3) return true;
		const captured = phaseAdj ? adj : inv;
		this.addMove(from, to, captured);
	}
	//if neighbor cell is a phase, leap_cell clear, and (enemy piece on phaseAdj XOR enemy piece on phaseFar)
}

Board.prototype.isJump = function (from, adj, direction, bypassCondition) {
	//if adj cell occupied, jumpCell in bounds, jumpCell clear, and jumpCell has enemy piece
	let to = adj+direction;
	if(this.inBounds(to)) {
		if (!this.getPlayer(to)) {
			if(bypassCondition%3) return true;
			else this.addMove(from, to, adj);
		}
	}
}

Board.prototype.canPhase = function (from, to, bypassCondition) {
	let isPhase = (this.board[to] & 1);
	let isDestinationEmpty = (this.board[from] & 3); //1 if player piece
	if(isPhase && isDestinationEmpty) {
		if (bypassCondition%3) return true;
		else this.addMove(from, to);
	}
}

//reaching this function implies selected piece can be cloned, so piece is on a bounding row
Board.prototype.getSpawnCells = function (from, bypassCondition) {
	const spawnRow = ( from/BOARD_SIZE ^ (BOARD_SIZE-1) );
	for(let col=1; col<BOARD_SIZE-1;col++) {
		let to = spawnRow*BOARD_SIZE + col;
		let spawnCellEmpty = !(this.board[to] & 4);

		//if spawnCell doesn't have a player on it
		if (spawnCellEmpty) {
			if (bypassCondition%3) return true;
			else this.addMove(from, to);
		}
	}
}

Board.prototype.getMovesInDirection = function (from, direction, bypassCondition) {
	//check adjacent cells of piece p wrt the boundary
	const adj = from+direction;
	let isPhase = this.board[adj] & 1;

	if (isPhase && this.canLeap(from, adj, bypassCondition)) return true;

	if( this.getPlayer(adj) ) {
		if (this.isJump(from, adj, direction, bypassCondition)) return true;
	}
	else if (bypassCondition%3%2) return bypassCondition%2;	//adjacent moves
	else if (!bypassCondition) this.addMove(from, adj);
	return false;
}

/* bypassCondition (HIGHLIGHT BYPASS CONDITION):
		undefined - default (Store all),
		1 - bypass any,
		2 - bypass continuable moves,
		3 - store continuable moves
*/
Board.prototype.getMoves = function (from, bypassCondition, direction) {
	// move continuation AND has a move in specified direction
	if (direction && this.inBounds(from+direction)) {
		if( this.getMovesInDirection(from, direction, bypassCondition) ) return true;
	} else if(bypassCondition === undefined || bypassCondition%3){
		//step, jump, leap
		for(let r=-1;r<2;r++) for(let c=-1;c<2; c++) { //from + (-8) + (-1) ... from + (8) + 1
			direction = (r*BOARD_SIZE) + c;
			const adj = from+direction;
			//enemy or empty cell
			let validDirection = ( this.getPlayer(adj) ^ this.getPlayer(from) ) && this.inBounds(adj) && (direction);
			if (validDirection && this.getMovesInDirection(from, direction, bypassCondition)) return true;
		}
	}
	// on a phase
	if (!this.isRedundantMove(from, this.getInverseIndex(from))
	&& this.canPhase(from, this.getInverseIndex(from), bypassCondition)) return true;
	// able to clone
	if (!(this.board[from] & 16) && this.onCloningCell(from)
	&& this.getSpawnCells(from, bypassCondition)) return true;

	return false;
}

//Performs move. returns true if caught piece in process, else false
//NOTE: it is impossible to capture a piece at board index 0
Board.prototype.doMove = function (from, to) {

	if(this.isCloneMove(from, to)) {
		this.makeClone(from, to);
		this.removeHighlight();
		this.clearMoves();
		return;
	}

	const pi = this.board[from] >> 5;
	const piece = (pi << 5) | (this.board[from] & 16) | this.getPlayer(from);

	if( (this.board[to] & 12) === 8 ) {
		//SPECIAL PIECE *any player can move.... but how is TODO*
		this.board[to] |= (pi << 5);
	} else {
		//We can assume this cell is empty
		this.board[to] |= piece;
	}


	const capturedPiece = this.getCapturedPiece(pi, to);
	let direction;
	if(capturedPiece) {
		const ci = this.board[capturedPiece] >> 5;
		this.board[capturedPiece] &= 3;
		this.board[BOARD_AREA + ci] = ~this.board[BOARD_AREA + ci]; //He DED

		//if Leap, then we get the direction by the difference between captured index and adjacent movement cell
		const capturedAdjToDestination = (-9 <= (to-capturedPiece) && (to-capturedPiece) <= 9);
		const capturedDirection = capturedAdjToDestination ? to - capturedPiece : capturedPiece - from;
		//if can continue move in direction
		if( this.getMovesInDirection(to, capturedDirection, 2) ) direction = capturedDirection;
	}
	const onPhase = this.board[to] & 1;
	const phased = this.isPhaseMove(from, to);
	const isLeap = capturedPiece && phased;
	const yetToPhase = onPhase && !phased;
	const canClone = (this.onCloningCell(to) && !this.onCloningCell(from) && this.getSpawnCells(to, 2));
	//If can clone or is on phase that piece hasn't just travelled through
	if ( !direction && ( canClone || isLeap || yetToPhase ) ) direction = 0;

	this.board[from] &= 3; //keep only cell data
	this.board[BOARD_AREA + pi] = to;

	this.removeHighlight();
	this.clearMoves();

	return direction;
}

Board.prototype.highlightMoves = function (piece) {
	const nMoves = this.moves[piece].length;
	for(let i=0; i<nMoves; i++) {
		let to = ( this.moves[piece][i] & (BIT_AREA - 1) );
		this.board[to] |= 2;
	}
}

Board.prototype.isPhaseMove = function (from, to) {
	const bothPhases = (this.board[from] & this.board[to]) & 1;
	return (bothPhases) && this.getInverseIndex(from) === to;
}


Board.prototype.removeHighlight = function () {
	for(let i=0; i<BOARD_AREA; i++) {
		if(this.board[i] & 2) (this.board[i] = this.board[i] ^ 2);
	}
}

/*==========											INTEGRITY													==========*/

//ONLY WORKS on NxN boards and phase group orders of 2
Board.prototype.getInverseIndex = function (index) {
	return (BOARD_AREA - 1) - index;
}

Board.prototype.inBounds = function (index) {
	return 0 <= index && index < BOARD_AREA;
}

// Board.prototype.canContinueMove = function (from, direction) {
// 	return direction !== undefined ? this.getMoves(from, 2, from+direction) : false;
// }

Board.prototype.hasMoves = function (piece) {
	return this.getMoves(piece, 1);
}

//Player has no more moves when (1): all player's pieces are dead (2): every piece has no moves
Board.prototype.movesLeft = function (player) {
	const c = (player === 12) ? BIT_MAX_PI : 0;
	for(let pi=c; pi < 2*BOARD_SIZE + c; pi++) {

		let piece = this.board[BOARD_AREA + pi];
		if ( !(piece < 0 || piece === undefined) && this.getMoves(piece, 1)) return true;
	}
	return false;
}

Board.prototype.validMove = function (piece, index) {
	const n = this.moves[piece].length;
	let isAvailableMove = 0;
	for(let i=0; i<n; i++) {
		if ( (this.moves[piece][i] & (BIT_AREA - 1)) === index ) isAvailableMove++;
	}
	return !!(isAvailableMove);
}

export default Board;
