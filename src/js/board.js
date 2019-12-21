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
for i = SIZE*SIZE + key			wher

*/


	/*TODO: 17, 19, 22 are based on the default layout,
		This function assumes the phases are symmetric on both axes
		Need to have a function that checks if only symmetric on at least one			//7x9 (row x col) relative origin = (4,5)
			-calculates offsets
					17
					17 + (len-1-bufferSize)/nRowPartitions x len
					17 + (len-1-bufferSize)/nColPartitions
					17 + (len-1-bufferSize)/nRowPartitions + (len-1-bufferSize)/nColPartitions x len
					board[i + j*len] = 1^(
						(i + j*len)^17 & (i + j*len)^19 & (i + j*len)^26
					&	(i + j*len)^41 & (i + j*len)^34 & (i + j*len)^43
					&	(i + j*len)^20 & (i + j*len)^29 & (i + j*len)^22
					&	(i + j*len)^44 & (i + j*len)^37 & (i + j*len)^46 );
				}
	*/
//can I generate layouts on seeds? lmao


function Board(len, phaseLayout) {
	this.p1 = 4;
	this.p2 = 12;
	this.len = len;
	this.area = len*len;
	(this.board = []).length = this.area + 4*len;
	this.board.fill(0);
	this.bufferSize = 1;
	this.init(phaseLayout);
	//this.update();
}



Board.prototype.init = function (layout) {
    let key=0;
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
			this.board[i] = ( (key << 5) | this.p1); //00000 0 01 00
			this.initPiece(this.area + key, 0, i);
			this.board[i + (len-1)*len] = ( (key + 2*len << 5) | this.p2); //10000 0 11 00
			this.initPiece(this.area + (key + 2*len), (len-1)*len, i);
			key++;

			for(let j=1+this.bufferSize; j<len-1-this.bufferSize; j++) {
				this.board[i + j*len] |= calcPhases(i+j*len);
			}
		}
}

Board.prototype.initPiece = function (i, row, col) {
	this.board[i] = (row << 4) | col;
}

Board.prototype.getPlayer = function (row, col) {
	return this.board[row*this.len + col];
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

Board.prototype.isPhase = function (p, bypassCondition) {
	let isPhase = util.cellType(p.row, p.col) > 1;
	let destinationCell = this.board[7 - p.row][7 - p.col];
	if(isPhase && destinationCell.who === null) {
		if (bypassCondition%3) return true;
		else destinationCell.move = true;
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
Board.prototype.getMoves = function (pi, bypassCondition, r, c) {

	let p = this.pieces[pi];
	//TODO: ref this.board[p.row + r][p.col + r].who, and set highlight = true for every destination
	if (this.isPhase(p, bypassCondition)) return true;
	if (this.canClone(pi) && this.getCloneSpawns(p, bypassCondition)) return true;

	if (r != null && c != null) {
		if (this.getMovesInDirection(p, bypassCondition, r, c)) return true;
	} else {
		for(r=-1;r<2;r++) for(c=-1;c<2; c++) {
			if (this.getMovesInDirection(p, bypassCondition, r, c)) return true;
		}
	}

	return false;
}

//Performs move. returns true if caught piece in process, else false
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
