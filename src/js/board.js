//'use strict';
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
export var BOARD_SIZE, BOARD_AREA, BIT_SIZE, BIT_MAX_PI, BIT_INDEX_SHIFT, BIT_AREA;
const PLAYER_ONE = 4
const PLAYER_TWO = 12;

function getBitShift(b) {
  return (b >> 1) ? (1 + getBitShift(b >> 1)) : 1;
}


function Board(player, len, phaseLayout) {
	//no args passed mean it will be a copy.
	if (player) {
		this.player = player;
		BOARD_SIZE = len;
		BOARD_AREA = BOARD_SIZE**2;
		BIT_SIZE = 2**getBitShift(BOARD_SIZE-1);
		BIT_MAX_PI = 2*BIT_SIZE;
		BIT_INDEX_SHIFT = getBitShift(BOARD_AREA-1);
		BIT_AREA = 2**BIT_INDEX_SHIFT;

		this.init(phaseLayout);
	}
}

Board.prototype.init = function (layout) {
	this.pAmount = {
		[PLAYER_ONE]: BOARD_SIZE,
		[PLAYER_TWO]: BOARD_SIZE
	};
	this.continuedMove = false;
	(this.board = []).length = BOARD_AREA + 4*BOARD_SIZE;
	(this.moves = []).length = 4*BOARD_SIZE;
	this.board.fill(0, 0, BOARD_AREA-1);
	this.bufferSize = 1;	//how many rows between the pieces' starting location and the nearest phases

  let pi=0; //piece Index (ID)
	const lastRow = (BOARD_SIZE-1)*BOARD_SIZE;

	const calcPhases = (index) => {
		let k = 0;
		while(k<phaseLayouts[layout].length) {
			if ( (index^phaseLayouts[layout][k]) === 0 ) return 1;
			k++;
		}
		return 0;
	};
	this.clearMoves();
	for (let i=0; i<BOARD_SIZE; i++) {
		this.board[i] = ( (pi << 5) | PLAYER_ONE); //00000 0 01 00
		this.initPiece(pi, i);

		this.board[i + lastRow] = ( (pi + BIT_MAX_PI << 5) | PLAYER_TWO); //100000 0 11 00
		this.initPiece(pi + BIT_MAX_PI, i + lastRow);
		pi++;

		for (let j=1+this.bufferSize; j<(BOARD_SIZE-1)-this.bufferSize; j++) {
			this.board[i + j*BOARD_SIZE] |= calcPhases(i+j*BOARD_SIZE);
		}
	}
}

Board.prototype.initPiece = function (key, index) {
	this.board[BOARD_AREA + key] = index;
}

Board.prototype.copy = function () {
	const board = new Board();
	const n = BOARD_AREA + 4*BOARD_SIZE;
	(board.board = []).length = n;
	(board.moves = []).length = this.moves.length;

	//copy over the board info (including piece directory)
	board.board = [...this.board];

	board.player = this.player;
	board.continuedMove = this.continuedMove;
	board.pAmount = {...this.pAmount};
	board.clearMoves();
	return board;
}


// moves[pi] = [0000000 0000000] --> [board index of captured piece + board index of destination cell]
Board.prototype.addMove = function (from, to, captured) {
	captured = captured || 0;
	const pi = (this.board[from] >> 5);
	this.moves[pi].push( (captured << (BIT_INDEX_SHIFT) ) + to );
}

Board.prototype.clearMoves = function (pi) {
	if (pi !== undefined) {
		this.moves[pi] = [];
		return;
	}
	for (let i=0; i<4*BOARD_SIZE; i++) this.moves[i] = [];
}



Board.prototype.highlightMoves = function (piece) {
	const nMoves = this.moves[piece].length;
	for (let i=0; i<nMoves; i++) {
		let to = ( this.moves[piece][i] & (BIT_AREA - 1) );
		this.board[to] |= 2;
	}
}

Board.prototype.removeHighlight = function () {
	for (let i=0; i<BOARD_AREA; i++) {
		if (this.board[i] & 2) (this.board[i] = this.board[i] ^ 2);
	}
}



/*==========											CLONE															==========*/

//Assume special tiles won't appear on spawn rows
Board.prototype.makeClone = function (from, to) {
	const player = this.player;
	this.pAmount[player]++;
	const c = (player === 12) ? BIT_MAX_PI : 0;
	let key;
	//Find first empty slot
	for (key= BOARD_SIZE+c; key< 2*BOARD_SIZE+c; key++) {
		if (this.board[BOARD_AREA + key] === undefined) {
			this.board[BOARD_AREA + key] = to;
			this.board[to] = (key << 5) | player | 16;
			this.board[from] |= 16;
			break;
		}
	}
}

Board.prototype.onCloningCell = function (from) {
	const onRow = from/BOARD_SIZE
	const piece = this.board[from];
	const onBoundaryColumn = (from+1)%BOARD_SIZE < 2;
	const onBoundaryRow = (onRow + 1)%BOARD_SIZE < 2;

	//To clone: NOT be on boundary column, BE on boundary row, NOT be cloned yet
	if (onBoundaryColumn || !onBoundaryRow || (piece & 16) ) return false;

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

Board.prototype.canLeap = function (from, adj, bypass) {
	const to = this.getInverseIndex(from);

	//DOES NOT CONSIDER SPECIAL PIECE '10'
	if (this.getPlayer(to)) return;

	const inv = this.getInverseIndex(adj);
	const phaseAdj = this.getPlayer(adj);
	const phaseFar = this.getPlayer(inv);

	if ( (phaseAdj ^ phaseFar ^ this.player) === 8 ) {
		if (bypass) return true;
		else this.addMove(from, to, (phaseAdj ? adj : inv));
	}
	//if neighbor cell is a phase, leap_cell clear, and (enemy piece on phaseAdj XOR enemy piece on phaseFar)
}

Board.prototype.canJump = function (from, direction, bypass) {
	//if adj cell occupied, jumpCell in bounds, jumpCell clear, and jumpCell has enemy piece
	const adj = from+direction;
	const to = adj+direction;
	if (this.inBounds(to) && !this.getPlayer(to)) {
		if (bypass) return true;
		else this.addMove(from, to, adj);
	}
}

Board.prototype.isPhaseMove = function (from, to, captured) {
	const bothPhases = (this.board[from] & this.board[to]) & 1;
	return !captured && bothPhases && this.getInverseIndex(from) === to;
}

Board.prototype.canPhase = function (from, to, bypass) {
	const isPhase = (this.board[from] & 1);
	const isDestinationEmpty = !(this.board[to] & 4); //1 if player piece
	if (isPhase && isDestinationEmpty) {
		if (bypass) return true;
		else this.addMove(from, to);
	}
}

//reaching this function implies selected piece can be cloned, so piece is on a bounding row
Board.prototype.getSpawnCells = function (from, bypass) {
	const spawnRow = ( from/BOARD_SIZE ^ (BOARD_SIZE-1) );
	for (let col=1; col<BOARD_SIZE-1;col++) {
		let to = spawnRow*BOARD_SIZE + col;
		let spawnCellEmpty = !(this.board[to] & 4);

		//if spawnCell doesn't have a player on it
		if (spawnCellEmpty) {
			if (bypass) return true;
			else this.addMove(from, to);
		}
	}
}

Board.prototype.getMovesInDirection = function (from, direction, bypass) {
	//check adjacent cells of piece p wrt the boundary
	const adj = from+direction;
	const isPhase = this.board[adj] & 1;
	const jumpWithinBounds = Math.abs( (adj+direction)%BOARD_SIZE - from%BOARD_SIZE ) < 3;
	if (isPhase && this.canLeap(from, adj, bypass)) return true;

	if ( (this.getPlayer(adj) ^ this.player) === 8 && jumpWithinBounds) {
		if (this.canJump(from, direction, bypass) ) return true;
 	}
	else if (bypass) return true;
	else this.addMove(from, adj);
}

//bypass: if you want to see if this piece is able to move
Board.prototype.getMoves = function (from, bypass) {

	const bCol = (from+1)%BOARD_SIZE < 2 ? (from+1)%BOARD_SIZE : undefined;
	for (let r=-1; r<2; r++) {
		for (let c=-1+(bCol === 1 ? 1 : 0); c<2-(bCol === 0 ? 1 : 0); c++) {
			let direction = (r*BOARD_SIZE) + c;
			let adj = from+direction;

			//enemy or empty cell
			let validDirection = (direction) && ( this.getPlayer(adj) ^ this.player ) && this.inBounds(adj);
			if ( validDirection && this.getMovesInDirection(from, direction, bypass) ) return true;
		}
	}
	const inv = this.getInverseIndex(from);
	// phase condition
	if ( !this.isRedundantMove(from, inv) && this.canPhase(from, inv, bypass) ) return true;
	// clone condition
	if (!(this.board[from] & 16) && this.onCloningCell(from) && this.getSpawnCells(from, bypass)) return true;
}


//returns how many pieces this player can move
Board.prototype.getAllMoves = function (player) {
	const c = (player === 12) ? BIT_MAX_PI : 0;
	var hasMoves = 0;
	for (let key=c; key < 2*BOARD_SIZE + c; key++) {
		let from = this.board[BOARD_AREA + key];
		if (!(from === undefined || from < 0)) {
			hasMoves++;
			this.getMoves(from);
		}
	}
	return hasMoves;
}

//Performs move. returns true if enemy runs out of pieces
//NOTE: it is impossible to capture a piece at board index 0
Board.prototype.doMove = function (from, to) {
	//CACHE this.board HERE. ITS A VERY HOT FUNCTION lmao (. Y .)
	if (this.isCloneMove(from, to)) {
		this.makeClone(from, to);
		this.removeHighlight();
		this.clearMoves();
		this.continuedMove = false;
		return;
	}
	const pi = this.board[from] >> 5;
	const capturedPiece = this.getCapturedPiece(pi, to);
	this.removeHighlight();
	this.clearMoves();

	const piece = (pi << 5) | (this.board[from] & 16) | this.player;

	if ( (this.board[to] & 12) === 8 ) {
		//SPECIAL PIECE *any player can move.... but how is TODO*
		this.board[to] |= (pi << 5);
	} else {
		//We can assume this cell is empty
		this.board[to] |= piece;
	}

	if (capturedPiece) {
		const ci = this.board[capturedPiece] >> 5;
		if(ci < 0) debugger;
		this.board[capturedPiece] &= 3;
		this.board[BOARD_AREA + ci] = ~this.board[BOARD_AREA + ci]; //He DED


		if( (--this.pAmount[(this.player ^ 8)]) === 0) return true;
		//if Leap, then we get the direction by the difference between captured index and adjacent movement cell
		const capturedAdjToDestination = (-9 <= (to-capturedPiece) && (to-capturedPiece) <= 9);
		const capturedDirection = capturedAdjToDestination ? (to-capturedPiece) : (capturedPiece - from);
		//if can continue move in direction
		let adj = to+capturedDirection;
		if ( this.board[adj] & 1 ) this.canLeap(to, adj);
		if ( this.getPlayer(adj) ^ this.player === 2) this.canJump(to, capturedDirection);
	}
	this.board[from] &= 3; //keep only cell data
	this.board[BOARD_AREA + pi] = to;

	//const isLeap = capturedPiece && alreadyPhased;
	const canPhase = (this.board[to] & 1) && !this.isPhaseMove(from, to, capturedPiece);
	const canClone = this.onCloningCell(to) && !this.onCloningCell(from);
	//If can clone or is on phase that piece hasn't just travelled through
	if ( canPhase ) this.canPhase(to, this.getInverseIndex(to));
	if ( canClone )	this.getSpawnCells(to);

	//if not a continued move, change player
	if(!this.moves[pi].length) this.switchPlayer();
	else {this.continuedMove = to;/*debugger;*/}

	return false;
}



/*==========											REFERENCES												==========*/

Board.prototype.getPlayer = function (index) {
	const pid = (this.board[index] & 12);
	return (pid === 4 || pid === 12) ? pid : 0;
}
//NOTE: index 0 can never be captured
//How to optimize? Well, if moves[pid][i] !< BOARD_AREA, then it must be a capture

Board.prototype.getCapturedPiece = function (pid, to) {
	const nMoves = this.moves[pid].length;
	for (let i=0; i< nMoves; i++) {
		let move = this.moves[pid][i];
		let capturedPiece = move >> (BIT_INDEX_SHIFT);
		if (capturedPiece >= BOARD_AREA) debugger;
		if ( (move & (BIT_AREA - 1)) === to  && capturedPiece) return capturedPiece;
	}
}

//ONLY WORKS on NxN boards and phase group orders of 2
Board.prototype.getInverseIndex = function (index) {
	return (BOARD_AREA - 1) - index;
}

/*==========											UTILITY														==========*/

Board.prototype.inBounds = function (index) {
	return 0 <= index && index < BOARD_AREA;
}

Board.prototype.switchPlayer = function () {
	this.player ^= 8;
	this.continuedMove = false;
	return this.player;
}

Board.prototype.isRedundantMove = function (from, to) {
	const pi = (this.board[from] >> 5);
	const n = this.moves[pi].length;
	for (let i=0; i<n; i++) {
		if ( (this.moves[pi][i] & (BIT_AREA-1)) === to ) return true;
	}
	return false;
}

//Player has no more moves when (1): all player's pieces are dead (2): every piece has no moves
// Board.prototype.movesLeft = function (player) {
// 	const c = (player === 12) ? BIT_MAX_PI : 0;
// 	for (let key=c; key < 2*BOARD_SIZE + c; key++) {
// 		let piece = this.board[BOARD_AREA + key];
// 		if ( !(piece < 0 || piece === undefined) && this.getMoves(piece, true) ) return true;
// 	}
// 	return false;
// }

Board.prototype.validMove = function (piece, index) {
	const n = this.moves[piece].length;
	for (let i=0; i<n; i++) {
		if ( (this.moves[piece][i] & (BIT_AREA - 1)) === index ) return true;
	}
	return false;
}

//not sure how performant this is...
Board.prototype.randomMove = function () {
	if (!this.continuedMove) {
		//if no moves, enemy wins
		if (!this.getAllMoves(this.player)) return (this.player ^ 8);
		const moves = {...this.moves};
		const reducedMoveList = Object.keys(moves)
			.filter( item => moves[item].length)
			.reduce( (res, key) => (res[key] = moves[key], res), {} );
		const moveKeys = Object.keys(reducedMoveList);
		const length = moveKeys.length;
		const piece = moveKeys[Math.floor(Math.random() * length)];
		const to = reducedMoveList[piece][Math.floor(Math.random() * reducedMoveList[piece].length)] & (BIT_AREA - 1);
		const from = this.board[BOARD_AREA + parseInt(piece)];

		return (this.doMove(from, to)) ? this.player : 0;
	} else {

		this.clearMoves();
		const from = this.continuedMove;
		this.getMoves(from);
		const pi = this.board[from] >> 5;
		const to = this.moves[pi][Math.floor(Math.random() * this.moves[pi].length)] & (BIT_AREA - 1);

		return (this.doMove(from, to)) ? this.player : 0;
	}

}

//what should the heuristic be??
Board.prototype.score = function () {
	let p1 = 0;
	let p2 = 0;
	const p = {...this.board.slice(BOARD_AREA)};
	const pieces = Object.keys(p)
		.filter( item => p[item] !== undefined)
		.reduce( (res, key) => (res[key] = p[key], res), {} );
	const n = Object.keys(pieces).length;
	for (let pi in pieces) {
		const isClone = pieces[pi] & 16;
		const score = (2+!isClone);
		if (parseInt(pi)/BIT_MAX_PI) p2 += score;
		else p1 += score;
	}
	if (p1 > p2) return PLAYER_ONE;
	else if (p2 > p1) return PLAYER_TWO;
	else return 0;
}


export default Board;
