var util = require('./util.js');
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
for i = SIZE*SIZE + key



index = cell number
key = piece index

*/


//can I generate layouts on seeds? lmao


function Board(len, phaseLayout) {
	function getBitShift(b) {
		return (b >> 1) ? (1 + getBitShift(b >> 1)) : 0;
	}
	this.p1 = 4;
	this.p2 = 12;

	this.len = len;
	this.area = len*len;
	this.BIT_SHIFT = getBitShift(len-1);
	this.BIT_LENGTH = 2**this.BIT_SHIFT;
	this.BIT_AREA = 2**(this.BIT_SHIFT*2);

	(this.board = []).length = this.area;
	(this.moves = []).length = 4*len;

	this.board.fill(0);
	this.bufferSize = 1;	//how many rows between the pieces' starting location and the nearest phases
	this.init(phaseLayout);
	//this.update();
}



Board.prototype.init = function (layout) {
    let pi=0; //piece Index (ID)
		const len = this.len;

		const calcPhases = (index) => {
			let k = 0;
			while(k<util.phaseLayouts[layout].length) {
				if ( (index^util.phaseLayouts[layout][k]) === 0 ) return 1;
				k++;
			}
			return 0;
		};

		for(let i=0; i<len; i++) {
			this.board[i] = ( (pi << 5) | this.p1); //00000 0 01 00
			this.initPiece(pi);
			this.board[i + (len-1)*len] = ( (pi + 2*this.BIT_LENGTH << 5) | this.p2); //100000 0 11 00
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
	return ( (this.board[index] >> 5) < 2*this.BIT_LENGTH ) ? this.p1 : this.p2;
}

// moves[pi] = [0000000 0000000] --> [board index of captured piece + board index of destination cell]
Board.prototype.addMove = function (to, from, captured) {
	captured = captured || 0;
	let pi = (this.board[to] >> 5);
	this.moves[pi].push( (captured << 2*this.BIT_SHIFT) + from );
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

Board.prototype.makeClone = function (pi, row, col) {
	/*
	getPlayer bit
	*/
	this.board[row*this.len + col] |= this.getPlayer(row, col)
	this.updateBoard(true);
	this.board[row][col].who = this.piecesSeparator;
	return true;
}

Board.prototype.canClone = function (pi) {
	let p = this.pieces[pi];
	return (!p.cloned && p.col < 7 && p.col > 0
		&& ( (p.player === this.p1 && !p.row)
		|| (p.player === this.p2 && p.row === 7) ));
}

Board.prototype.isCloneSpawn = function (pi, row, col) {
	return this.canClone(pi) && this.board[row][col].who === null;
}

/*==========											MOVES															==========*/

// Board.prototype.getPlayer = function (pi) {
// 	return this.pieces[pi].player;
// }

Board.prototype.isLeap = function (p, rowIncr, colIncr, isPhase, cellAdj, bypassCondition) {
	//if neighbor cell is a phase, leap_cell clear, and (enemy piece on phaseAdj XOR enemy piece on phaseFar)
	let destinationCell = this.board[7 - p.row][7 - p.col];
	if(isPhase && !destinationCell.who) {
		let phaseAdj = cellAdj.who;
		let phaseFar = this.board[7 - (p.row + rowIncr)][7 - (p.col + colIncr)].who;
		if((phaseAdj || phaseFar) && !(phaseAdj && phaseFar)) { //xor filter. Only one may be true
			let capt = phaseAdj ? phaseAdj : phaseFar;
			//if 0, add to destinationCell.move, if 1,
			if (bypassCondition) return true;
			else destinationCell.move = capt;
		}
	}
}

Board.prototype.isJump = function (p, rowIncr, colIncr, cellAdj, bypassCondition) {
	//if adj cell occupied, jumpCell in bounds, jumpCell clear, and jumpCell has enemy piece
	if(util.inBounds(p.row + rowIncr*2, p.col + colIncr*2)) {
		let destinationCell = this.board[p.row + rowIncr*2][p.col + colIncr*2];
		if (this.getPlayer(cellAdj.who) !== p.player && destinationCell.who === null) {
			if(bypassCondition%3) return true;
			else destinationCell.move = cellAdj.who;
		}
	}
}

Board.prototype.canPhase = function (i, bypassCondition) {
	let len= this.len - 1;
	//j = 7-row_index + 7-col_index
	let j = ( (len - (i >> this.BIT_SHIFT)) << this.BIT_SHIFT ) + ( len - (i & (this.BIT_LENGTH-1) ) );
	let isPhase = (this.board[i] & 1);
	let isDestinationEmpty = (this.board[j] & 3); //1 if player piece
	if(isPhase && isDestinationEmpty) {
		if (bypassCondition%3) return true;
		else this.addMove(i, j);
	}
}

Board.prototype.getCloneSpawns = function (p, bypassCondition) {
	let row = p.player === this.p1 ? 7 : 0;
	for(let col=1; col<7;col++) {
		let destinationCell = this.board[row][col];
		if (destinationCell.who === null) {
			if (bypassCondition%3) return true;
			else destinationCell.move = true;
		}
	}
}

Board.prototype.getMovesInDirection = function (p, bypassCondition, r, c) {
	//check adjacent cells of piece p wrt the boundary
	if(util.inBounds(p.row + r, p.col + c) && (r || c)) {
		let cellAdj = this.board[p.row + r][p.col + c];
		let isPhase = util.cellType(p.row + r, p.col + c) > 1;

		if (this.isLeap(p, r, c, isPhase, cellAdj, bypassCondition)) return true;
		if (cellAdj.who !== null) {
			if (this.isJump(p, r, c, cellAdj, bypassCondition)) return true;
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
Board.prototype.getMoves = function (index, bypassCondition, r, c) {

	if (this.canPhase(index, bypassCondition)) return true;
	if (this.canClone(index) && this.getCloneSpawns(index, bypassCondition)) return true;

	if (r != null && c != null) { //if move continuation
		if (this.getMovesInDirection(index, bypassCondition, r, c)) return true;
	} else {
		for(r=-1;r<2;r++) for(c=-1;c<2; c++) { //initial moves
			if (this.getMovesInDirection(index, bypassCondition, r, c)) return true;
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
		let destinationIndex = ( this.moves[pi][i] & (this.BIT_AREA - 1) );
		this.board[destinationIndex] |= 2;
	}
}

Board.prototype.removeHighlight = function () {
	for(let i=0; i<this.area; i++) {
		if(this.board[i] & 2) (this.board[i] = this.board[i] ^ 2);
	}
}

/*==========											INTEGRITY													==========*/

Board.prototype.samePhase = function (from, to) {
	let isDestinationPhase = util.cellType(to.row, to.col);
	return isDestinationPhase > 1 && isDestinationPhase === util.cellType(from.row, from.col);
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

module.exports = Board;
