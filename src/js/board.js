import {toIndex, getRow, getCol, cellType, phaseLayouts} from './util';
import {BIT_SHIFT, BIT_LENGTH, BIT_AREA, BOARD_SIZE, BOARD_AREA} from './Leap.js'
//single, phase, jump, super-jump
/*
adj: adjacent
phase: change portal side
leap: capture piece while jumping through a portal
jitch: jump, then phase
swump: switch, then jump
}

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


//can I generate layouts on seeds? lmao


function Board(len, phaseLayout) {

	this.p1 = 4;
	this.p2 = 12;

	//BOARD_SIZE = len;
	///BOARD_AREA = len*len;

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

		for(let i=0; i<len; i++) {
			this.board[i] = ( (pi << 5) | this.p1); //00000 0 01 00
			this.initPiece(pi);
			this.board[i + (len-1)*len] = ( (pi + 2*BIT_LENGTH << 5) | this.p2); //100000 0 11 00
			this.initPiece(pi + 2*len);
			pi++;

			for(let j=1+this.bufferSize; j<len-1-this.bufferSize; j++) {
				this.board[i + j*len] |= calcPhases(i+j*len);
			}
		}
}

Board.prototype.initPiece = function (pi) {
	this.moves[pi] = [];
}

Board.prototype.getPlayer = function (index) {
	let pid = (this.board[index] & 12);
	switch (pid) {
		case 12:
			return this.p2;
		case 4:
			return this.p1;
		default
			return 0;
	}
	//return ( (this.board[index] & 12) < 12 ) ? this.p1 : this.p2;
}

// moves[pi] = [0000000 0000000] --> [board index of captured piece + board index of destination cell]
Board.prototype.addMove = function (from, to, captured) {
	captured = captured || 0;
	let pi = (this.board[from] >> 5);
	this.moves[pi].push( (captured << 2*BIT_SHIFT) + to );
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
/* DEPRECIATED: we use bit shifts now
//Calls every time a clone is made
Board.prototype.insertAtSeparationIndex = function () {
	for(let pi=this.piecesSeparator; pi<this.pieces.length; pi++) {
		//Finds index that separates p1 and p2 pieces
		if(this.pieces[pi].player !== this.p2) {
			this.piecesSeparator = pi; //update
			return pi;
		}
	}
}
*/
Board.prototype.makeClone = function (pi, row, col) {
	/*
	getPlayer bit
	*/
	this.board[row*BOARD_SIZE + col] |= this.getPlayer(row, col)
	this.updateBoard(true);
	this.board[row][col].who = this.piecesSeparator;
	return true;
}

Board.prototype.canClone = function (i) {
	let row = i/BIT_LENGTH, piece = this.board[i];
	let onBoundingColumn = (i+1)%BIT_LENGTH < 2;
	let onBoundingRow = (row + 1)%BIT_LENGTH < 2;

	if(onBoundingColumn || !onBoundingRow || (piece & 16) ) return false;

	let spawnRow = (( (piece >> 5) & 2*BIT_LENGTH ) - 1) / 2;
	return (row ^ spawnRow);
}

/* DEPRECIATED: not used
Board.prototype.isCloneSpawn = function (pi, row, col) {
	return this.canClone(pi) && this.board[row][col].who === null;
}
*/
/*==========											MOVES															==========*/

// Board.prototype.getPlayer = function (pi) {
// 	return this.pieces[pi].player;
// }

Board.prototype.canLeap = function (from, adj, isPhase, bypassCondition) {
	let to = this.getInverseIndex(from);
	if( isPhase && !(getPlayer(to)) ) {
		let inv = this.getInverseIndex(adj);
		let phaseAdj = getPlayer(adj) & 8;
		let phaseFar = getPlayer(inv) & 8;

		if( (phaseAdj ^ phaseFar) ) {
			if (bypassCondition) return true;
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
		if (this.getPlayer(adj) !== this.getPlayer(from) && !this.getPlayer(to)) {
			if(bypassCondition%3) return true;
			else this.addMove(from, to, adj);
		}
	}
}

Board.prototype.canPhase = function (from, row, col, bypassCondition) {
	let len= BOARD_SIZE - 1;
	//j = 7-row_index + 7-col_index
	let to = ( (len - row) << BIT_SHIFT ) + (len - col);
	let isPhase = (this.board[to] & 1);
	let isDestinationEmpty = (this.board[from] & 3); //1 if player piece
	if(isPhase && isDestinationEmpty) {
		if (bypassCondition%3) return true;
		else this.addMove(from, to);
	}
}

//reaching this function implies selected piece can be cloned, so piece is on an bounding row
Board.prototype.getCloneSpawnCells = function (from, bypassCondition) {
	let spawnRow = ( from/BIT_LENGTH ^ (BIT_LENGTH - 1) );
	for(let col=1; col<7;col++) {
		let to = spawnRow + col;
		let spawnCell = this.board[to];
		if ( !(spawnCell & 4) ) {
			if (bypassCondition%3) return true;
			else this.addMove(from, to);
		}
	}
}

Board.prototype.getMovesInDirection = function (from, adj, bypassCondition, r, c) {
	//check adjacent cells of piece p wrt the boundary

	if(this.inBounds(adj) && (r || c)) {
		let isPhase = this.board[adj] & 1;
		let direction = adj - from;

		if (this.canLeap(from, adj, isPhase, bypassCondition)) return true;
		if (cellAdj.who !== null) {
			if (this.isJump(from, adj, direction, bypassCondition)) return true;
		}
		else if (bypassCondition%3%2) return true;	//adjacent moves
		else if (!bypassCondition) cellAdj.move = true;
	}
	return false;
}

/* bypassCondition (HIGHLIGHT BYPASS CONDITION):
		undefined - default (Store all),
		1 - bypass all,
		2 - bypass continuable moves,
		3 - store continuable moves
*/
Board.prototype.getMoves = function (from, bypassCondition, r, c) {
	let row = (from >> BIT_SHIFT), col = (from & (BIT_LENGTH-1));
	if (this.canPhase(from, row, col, bypassCondition)) return true;
	if (this.canClone(from)) if(this.getCloneSpawnCells(from, bypassCondition)) return true;

	if (r != null && c != null) { //if move continuation
		if (this.getMovesInDirection(from, (row + r) << BIT_SHIFT + (col + c), bypassCondition, r, c)) return true;
	} else {
		for(r=-1;r<2;r++) for(c=-1;c<2; c++) { //initial moves
			if (this.getMovesInDirection(from, (row + r) << BIT_SHIFT + (col + c), bypassCondition, r, c)) return true;
		}
	}

	return false;
}

//Performs move. returns true if caught piece in process, else false
//NOTE: it is impossible to capture a piece at board index 0
Board.prototype.doMove = function (pi, row, col) {
	let p = this.pieces[pi];
	//begin move
	this.board[p.row][p.col].who = null;

	let destinationCell = this.board[row][col];
	let caught = typeof(destinationCell.move) === "number" ? destinationCell.move : false; //caught piece index
	// moveDirection is defined if and only if any of the following is true (for moving piece p):
	let moveDirection;
		// (1) p caught a piece
	if (caught) {
		let c = this.pieces[caught];
		c.alive = false;
		this.board[c.row][c.col].who = null;
		//return direction of move
		//If leap, then c adjacent at start XOR c adjacent at end
		//Check adjacency of moving piece to captured piece on starting position and ending position
		let cellAdjStartPos = Math.abs(c.row - p.row) < 2 && Math.abs(c.col - p.col) < 2;
		let cellAdjEndPos = Math.abs(row - c.row) < 2 && Math.abs(col - c.col) < 2;

		moveDirection = (cellAdjStartPos && cellAdjEndPos)
			? {rowIncr: Math.sign(row-c.row), colIncr: Math.sign(col-c.col)}	//jump
			: (cellAdjStartPos
				? {rowIncr: Math.sign(c.row-p.row), colIncr: Math.sign(c.col-p.row)}	//leap-> piece adj to capture on start
				: {rowIncr: Math.sign(row-c.row), colIncr: Math.sign(col-c.col)});
	}	// (2) p LANDS on a phase cell. That is, this move is not a phase.
	else if (!this.samePhase(p,{row: row, col: col}))	moveDirection = {rowIncr: 0, colIncr: 0};

	//end move
	this.board[row][col].who = pi;
	p.row = row;
	p.col = col;

		// (3) p is able to be cloned
	if (this.canClone(pi)) moveDirection = {rowIncr: 0, colIncr:0};
	this.updateBoard();
	return moveDirection;
}

Board.prototype.highlightMoves = function (pi) {
	let nMoves = this.moves[pi].length;
	for(let i=0; i<nMoves; i++) {
		let destinationIndex = ( this.moves[pi][i] & (BIT_AREA - 1) );
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
	let row = (index >> BIT_SHIFT), col = (index & (BIT_LENGTH-1));
	return ( (len - row) << BIT_SHIFT ) + (len - col);
}

//Don't need -> can use dest cell shit
Board.prototype.samePhase = function (from, to) {
	let isDestinationPhase = cellType(to.row, to.col);
	return isDestinationPhase > 1 && isDestinationPhase === cellType(from.row, from.col);
}

Board.prototype.inBounds = function (index) {
	return 0 <= index && index < BIT_AREA;
}

Board.prototype.canContinueMove = function (pi, dir) {

	return dir ? this.getMoves(pi, 2, dir.rowIncr, dir.colIncr) : false;
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

Board.prototype.validMove = function (row, col) {
	return this.board[row][col].move;
}

export default Board;
