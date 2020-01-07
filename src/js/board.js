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
var BOARD_SIZE, BOARD_AREA, BIT_SHIFT, BIT_LENGTH, BIT_INDEX_SHIFT, BIT_AREA;

const toIndex = (row, col) => (row << BIT_SHIFT) + col;

const getRow = (index) => (index >> BIT_SHIFT);
const getCol = (index) => (index & (BIT_LENGTH-1));

function getBitShift(b) {
  return (b >> 1) ? (1 + getBitShift(b >> 1)) : 1;
}


function Board(len, phaseLayout) {

	this.p1 = 4;
	this.p2 = 12;

	BOARD_SIZE = len;
	BOARD_AREA = BOARD_SIZE**2;
	BIT_SHIFT = getBitShift(BOARD_SIZE-1);
	BIT_LENGTH = 2**BIT_SHIFT;
	BIT_INDEX_SHIFT = getBitShift(BOARD_AREA-1);
	BIT_AREA = 2**BIT_INDEX_SHIFT;


	(this.board = []).length = BOARD_AREA;
	(this.moves = []).length = 4*len;
	this.board.fill(0);
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
			this.board[i + (len-1)*len] = ( (pi + 2*BIT_LENGTH << 5) | this.p2); //100000 0 11 00
			pi++;

			for(let j=1+this.bufferSize; j<len-1-this.bufferSize; j++) {
				this.board[i + j*len] |= calcPhases(i+j*len);
			}
		}
}

Board.prototype.clearMoves = function () {
	for(let i=0; i<4*BOARD_SIZE; i++) this.moves[i] = [];
}

// moves[pi] = [0000000 0000000] --> [board index of captured piece + board index of destination cell]
Board.prototype.addMove = function (from, to, captured) {
	captured = captured || 0;
	let pi = (this.board[from] >> 5);
	this.moves[pi].push( (captured << (BIT_INDEX_SHIFT) ) + to );
}

Board.prototype.getPlayer = function (index) {
	let pid = (this.board[index] & 12);
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
		if( (move & (BIT_AREA - 1)) === to ) return move >> (BIT_INDEX_SHIFT);
	}
	return false;
}



Board.prototype.update = function (newPiece) {
	if (newPiece) {
		//find out which player this piece belongs to then add it within that player's key range (00000)
		this.board = this.board.map(row => row.map((cell, j) => {
			if (cell.who != null) { //increment all pi in board after piecesSeparator by one
				if (cell.who >= this.piecesSeparator) cell.who++;
				//if piece alive, keep on board
				return this.pieces[cell.who].alive ? {who: cell.who, move:false} : {who: null, move:false};
			} else return {who: null, move: false};
		}));
	} else {
		this.board = this.board.map(row => row.map((cell, j) =>
			(cell.who != null)
			? (this.pieces[cell.who].alive
				? {who: cell.who, move:false}
				: {who: null, move:false})
			: {who: null, move: false}
		));
	}
}



/*==========											CLONE															==========*/

Board.prototype.makeClone = function (pi, row, col) {
	/*
	getPlayer bit
	*/
	this.board[row*BOARD_SIZE + col] |= this.getPlayer(row, col)
	this.updateBoard(true);
	this.board[row][col].who = this.piecesSeparator;
	return true;
}


Board.prototype.canClone = function (from) {
	let onRow = from/BOARD_SIZE, piece = this.board[from];
	let onBoundaryColumn = (from+1)%BOARD_SIZE < 2;
	let onBoundaryRow = (onRow + 1)%BOARD_SIZE < 2;

	//To clone: NOT be on boundary column, BE on boundary row, NOT be cloned yet
	if(onBoundaryColumn || !onBoundaryRow || (piece ^ 16) ) return false;

	let spawnRow = (( (piece >> 5) & 2*BIT_LENGTH ) - 1) / 2;
	return (onRow ^ spawnRow);
}

//Assumes valid move
Board.prototype.isCloneMove = function (to, from) {
	//suffice to show if to and from are on opposing boundary rows
	let toRow = to/BOARD_SIZE, fromRow = from/BOARD_SIZE;
	return this.canClone(from) && (toRow ^ fromRow);
}

/*==========											MOVES															==========*/

// Board.prototype.getPlayer = function (pi) {
// 	return this.pieces[pi].player;
// }

Board.prototype.canLeap = function (from, adj, isPhase, bypassCondition) {
	let to = this.getInverseIndex(from);
	if( isPhase && !(this.getPlayer(to)) ) {
		let inv = this.getInverseIndex(adj);
		let phaseAdj = this.getPlayer(adj) & 8;
		let phaseFar = this.getPlayer(inv) & 8;

		if( (phaseAdj ^ phaseFar) ) {
			if (bypassCondition%3) return true;
			let captured = phaseAdj ? adj : inv;
			this.addMove(from, to, captured);
		}
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

//reaching this function implies selected piece can be cloned, so piece is on an bounding row
Board.prototype.getCloneSpawnCells = function (from, bypassCondition) {
	let spawnRow = ( from/BOARD_SIZE ^ (BOARD_SIZE-1) );
	for(let col=1; col<BOARD_SIZE-1;col++) {
		let to = spawnRow + col;
		let spawnCell = this.board[to];
		//if spawnCell doesn't have a player on it
		if ( spawnCell ^ 4 ) {
			if (bypassCondition%3) return true;
			else this.addMove(from, to);
		}
	}
}

Board.prototype.getMovesInDirection = function (from, adj, bypassCondition) {
	//check adjacent cells of piece p wrt the boundary
	let direction = adj - from;
	let isPhase = this.board[adj] & 1;

	if (this.canLeap(from, adj, isPhase, bypassCondition)) return true;

	if( this.getPlayer(adj) ) {
		if (this.isJump(from, adj, direction, bypassCondition)) return true;
	}
	else if (bypassCondition%3%2) return bypassCondition%2;	//adjacent moves
	else if (!bypassCondition) this.addMove(from, adj);
	return false;
}

/* bypassCondition (HIGHLIGHT BYPASS CONDITION):
		undefined - default (Store all),
		1 - bypass all,
		2 - bypass continuable moves,
		3 - store continuable moves
*/
Board.prototype.getMoves = function (from, bypassCondition, direction) {
	let row = getRow(from), col = getCol(from);

	// on a phase
	if (this.canPhase(from, this.getInverseIndex(from), bypassCondition)) return true;
	// able to clone
	if (this.canClone(from) && this.getCloneSpawnCells(from, bypassCondition)) return true;

	// move continuation AND has a move in specified direction
	if (direction !== undefined && this.inBounds(from+direction)) {
		if( this.getMovesInDirection(from, from+direction, bypassCondition) ) return true;
	} else {
		//step, jump, leap
		for(let r=-1;r<2;r++) for(let c=-1;c<2; c++) {
			let adj = toIndex(row + r, col + c);
			let validDirection = ( this.getPlayer(adj) ^ this.getPlayer(from) ) //enemy or empty cell
				&& this.inBounds(adj) && (adj-from);
			if (validDirection && this.getMovesInDirection(from, adj, bypassCondition)) return true;
		}
	}
	return false;
}

//Performs move. returns true if caught piece in process, else false
//NOTE: it is impossible to capture a piece at board index 0
Board.prototype.doMove = function (from, to) {

	if(this.isCloneMove(from, to)) {
		this.makeClone(to);
		return false;
	}

	let pi = this.board[from] >> 5;
	this.board[from] = this.board[from] & 31; //31 is constant -> 00000 ( 0 00 00 )

	if( (this.board[to] & 12) == 8 ) {
		//SPECIAL PIECE *any player can move.... but how is TODO*
		this.board[to] |= (pi << 5);
	} else {
		this.board[to] |= (pi << 5) | this.getPlayer(from);
	}

	let capturedPiece = this.getCapturedPiece(pi, to);
	let direction;
	if(capturedPiece) {
		this.board[capturedPiece] = this.board[capturedPiece] & 31;
		//if can continue move in direction
		if( this.inBounds(to - capturedPiece) && this.getMovesInDirection(to, to - capturedPiece, 2) ) {
			direction = to - capturedPiece;
		}
	}
	//If can clone or is on different phase than starting position
	if ( direction !== undefined && (this.canClone(pi) || !this.samePhase(from, to))) direction = 0;

	this.removeHighlight();
	this.clearMoves();
	
	return direction;
}

Board.prototype.highlightMoves = function (piece) {
	let nMoves = this.moves[piece].length;
	for(let i=0; i<nMoves; i++) {
		let destinationIndex = ( this.moves[piece][i] & (BIT_AREA - 1) );
		this.board[destinationIndex] |= 2;
	}
}

Board.prototype.removeHighlight = function () {
	for(let i=0; i<BOARD_AREA; i++) {
		if(this.board[i] & 2) (this.board[i] = this.board[i] ^ 2);
	}
}

/*==========											INTEGRITY													==========*/

Board.prototype.getInverseIndex = function (index) {
	let len = BOARD_SIZE - 1;
	let row = getRow(index), col = getCol(index);
	return toIndex(len - row, len - col);
}


Board.prototype.samePhase = function (from, to) {
	let isPhase = this.board[from] & 1;
	return isPhase && this.getInverseIndex(from) === to;
}

Board.prototype.inBounds = function (index) {
	return 0 <= index && index < BOARD_AREA;
}

Board.prototype.canContinueMove = function (from, direction) {
	return direction !== undefined ? this.getMoves(from, 2, from+direction) : false;
}

Board.prototype.hasMoves = function (pi) {
	return this.getMoves(pi, 1);
}

//Player has no more moves when (1): all player's pieces are dead (2): every piece has no moves
Board.prototype.movesLeft = function (player) {
	for(let pi=0; pi < this.pieces.length; pi++) {
		let p = this.pieces[pi];
		if(p.alive && p.player === player) {
			if(this.hasMoves(pi)) return true;
		}
	}
	return false;
}

Board.prototype.validMove = function (piece, index) {
	let n = this.moves[piece].length;
	let isAvailableMove = 0;
	for(let i=0; i<n; i++) {
		if ( (this.moves[piece][i] & (BIT_AREA - 1)) === index ) isAvailableMove++;
	}
	return !!(isAvailableMove);
}

export default Board;
