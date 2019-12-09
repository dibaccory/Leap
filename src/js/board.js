var util = require('./util.js');
//single, phase, jump, super-jump
/*
adj: adjacent
phase: change portal side
leap: capture piece while jumping through a portal
jitch: jump, then phase
swump: switch, then jump
}
*/
/*
LEGEND
pi = piece index in Board.pieces
p = piece Board.pieces[pi]
*/

/*
Previously, I assumed that if a uncloned piece reaches the end of the other player's side,
then that piece must duplicate before continuing the game. However, my assumption fails
if the player's spawn row is full and hence I will give the player the option to choose.

This realization got me thinking about adding different game modes that
modify things like the board size, and side-wrapping.

board size: If board were 9x9, we can put a clone phaser in the center
that duplicates any non-clone pieces at most once.

side wrapping: columns are cyclic: make board[row] = cyclic linked List?



Speaking of linked lists... Why am I not using them now?
Maybe this is what I needed to store highlight;
 represent each of this.state.selectedPiece's moves as a boolean for 'highlight' in
 this.board[row][col] = {who: p.player | null, highlight: true | false :: added in Board.getMoves(pi)}
 for some row,col,  and p = this.piece[pi]
 to Leap.setPiece(), add this.state.board.updateBoard()

*/


function Board(size, p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
	this.board = this.initBoard(size);
	this.piecesSeparator = 8;
	this.pieces = this.initPieces(size, p1, p2);
	this.updateBoard(); //add pieces to board
}

//TODO:
//this.board[row][col] = {who: p.player | null, highlight: {row: some_row, col: some_col} | null:: added in Board.getMoves(pi)}
//update occurs when (1) piece is cloned (pieces index may change)
// and when (2) setPiece is called
//To make highlight function properly, I'll have to call this.getMoves() from here.
//It follows that I will have to remove other calls to this.getMoves()
Board.prototype.updateBoard = function (newPiece) {
	if (newPiece) {
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

Board.prototype.initBoard = function (size) {
    let board = [], playerTwo = [], playerOne = [];
		//TODO: fill as {who: pi (this.pieces index), highlight: null}
		for (let i = 0; i < size; i++) {
			playerTwo.push({who: i, move: false});
			playerOne.push({who: i+8, move: false});
		}
		board.push(playerTwo);
		for (let i = 1; i < size-1; i++) board.push(Array(size).fill({who: null, move: false}));
		board.push(playerOne);

    return board;
}

Board.prototype.initPieces = function (size) {
	let whitePieces = [];
	let blackPieces = [];
	for (let c = 0; c < size; c++) {
		whitePieces.push({player: this.p1, cloned: false, row: 7, col: c, alive: true});
		blackPieces.push({player: this.p2, cloned: false, row: 0, col: c, alive: true});
	}
    return blackPieces.concat(whitePieces);
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
	let p = this.pieces[pi];
	p.cloned = true;
	let clone = {player: p.player, cloned: true, row: row, col: col, alive: true};
	this.pieces.splice(this.insertAtSeparationIndex(),0, clone); //add clone to pieces Array
	this.updateBoard(true);
	this.board[row][col].who = this.piecesSeparator;
	return true;
}

Board.prototype.canClone = function (pi) {
	let p = this.pieces[pi];
	return (!p.cloned && p.col < 7 && p.col > 0 && ( (p.player === this.p1 && !p.row) || (p.player === this.p2 && p.row === 7) ));
}

Board.prototype.isCloneSpawn = function (pi, row, col) {
	return this.canClone(pi) && this.board[row][col].who === null;
}

/*==========											MOVES															==========*/

Board.prototype.getPlayer = function (pi) {
	return this.pieces[pi].player;
}

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

//bypassCondition (HIGHLIGHT BYPASS CONDITION): undefined - default (Store all), 1 - bypass all, 2 - bypass continuable moves, 3 - store continuable moves
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
