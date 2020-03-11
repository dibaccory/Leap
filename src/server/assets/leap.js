//'use strict';
import {phaseLayouts} from './util';

var BOARD_SIZE, BOARD_AREA, BIT_SIZE, BIT_MAX_PI, BIT_INDEX_SHIFT, BIT_AREA;
const PLAYER_ONE = 4
const PLAYER_TWO = 12;

function getBitShift(b) {
  return (b >> 1) ? (1 + getBitShift(b >> 1)) : 1;
}


function Leap(player, len, phaseLayout) {
	//no args passed mean it will be a copy.
	if (player) {
		this.turn = player;
		BOARD_SIZE = len;
		BOARD_AREA = BOARD_SIZE**2;
		BIT_SIZE = 2**getBitShift(BOARD_SIZE-1);
		BIT_MAX_PI = 2*BIT_SIZE;
		BIT_INDEX_SHIFT = getBitShift(BOARD_AREA-1);
		BIT_AREA = 2**BIT_INDEX_SHIFT;

		this.init(phaseLayout);
	}
}

Leap.prototype.init = function (layout) {
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
			if (index === phaseLayouts[layout][k]) return 1;
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

Leap.prototype.initPiece = function (key, index) {
	this.board[BOARD_AREA + key] = index;
}

Leap.prototype.copy = function () {
	const board = new Leap();
	const n = BOARD_AREA + 4*BOARD_SIZE;
	(board.board = []).length = n;
	(board.moves = []).length = this.moves.length;

	//copy over the board info (including piece directory)
	board.board = [...this.board];

	board.turn = this.turn;
	board.continuedMove = this.continuedMove;
	board.pAmount = {...this.pAmount};
	board.clearMoves();
	return board;
}

Leap.prototype.set = function (board) {
  this.board = board.board;
  this.turn = board.turn;
  this.continuedMove = board.continuedMove;
  this.pAmount = board.pAmount;
  this.moves = board.moves;
  return this;
}

// moves[pi] = [0000000 0000000] --> [board index of captured piece + board index of destination cell]
Leap.prototype.addMove = function (from, to, captured) {
	captured = captured || 0;
	const pi = (this.board[from] >> 5);
	this.moves[pi].push( (captured << (BIT_INDEX_SHIFT) ) + to );
}

Leap.prototype.clearMoves = function (pi) {
	if (pi !== undefined) {
		this.moves[pi] = [];
		return;
	}
	for (let i=0; i<4*BOARD_SIZE; i++) this.moves[i] = [];
}

Leap.prototype.highlightMoves = function (piece) {
	const nMoves = this.moves[piece].length;
	for (let i=0; i<nMoves; i++) {
		let to = ( this.moves[piece][i] & (BIT_AREA - 1) );
		this.board[to] |= 2;
	}
}

Leap.prototype.removeHighlight = function () {
	for (let i=0; i<BOARD_AREA; i++) {
		if (this.board[i] & 2) (this.board[i] = this.board[i] ^ 2);
	}
}

/*==========											CLONE															==========*/

//Assume special tiles won't appear on spawn rows
Leap.prototype.makeClone = function (from, to) {
	const player = this.turn;
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

Leap.prototype.onCloningCell = function (from) {
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
Leap.prototype.isCloneMove = function (from, to) {
	//if on cloning cell, suffice to show if destination is on spawn row
	const spawnRow = ( (this.board[from] >> 5) & BIT_MAX_PI ) ? (BOARD_SIZE - 1) : 0;
	return this.onCloningCell(from) && (Math.floor(to/BOARD_SIZE) === spawnRow);
}

/*==========											MOVE LOGIC												==========*/

Leap.prototype.canLeap = function (from, adj) {
	const to = this.getInverseIndex(from);

	//DOES NOT CONSIDER SPECIAL PIECE '10'
	if (this.getPlayer(to)) return;

	const inv = this.getInverseIndex(adj);
	const phaseAdj = this.getPlayer(adj);
	const phaseFar = this.getPlayer(inv);

	if ( (phaseAdj ^ phaseFar ^ this.turn) === 8 ) {
		this.addMove(from, to, (phaseAdj ? adj : inv));
	}
	//if neighbor cell is a phase, leap_cell clear, and (enemy piece on phaseAdj XOR enemy piece on phaseFar)
}

Leap.prototype.canJump = function (from, direction) {
	//if adj cell occupied, jumpCell in bounds, jumpCell clear, and jumpCell has enemy piece
	const adj = from+direction;
	const to = adj+direction;
	if (this.inBounds(to) && !this.getPlayer(to)) {
		this.addMove(from, to, adj);
	}
}

Leap.prototype.isPhaseMove = function (from, to, captured) {
	const bothPhases = (this.board[from] & this.board[to]) & 1;
	return !captured && bothPhases && this.getInverseIndex(from) === to;
}

Leap.prototype.canPhase = function (from, to) {
	const isPhase = (this.board[from] & 1);
	const isDestinationEmpty = !(this.board[to] & 4); //1 if player piece
	if (isPhase && isDestinationEmpty) {
		this.addMove(from, to);
	}
}

//reaching this function implies selected piece can be cloned, so piece is on a bounding row
Leap.prototype.getSpawnCells = function (from) {
	const spawnRow = ( from/BOARD_SIZE ^ (BOARD_SIZE-1) );
	for (let col=1; col<BOARD_SIZE-1;col++) {
		let to = spawnRow*BOARD_SIZE + col;
		let spawnCellEmpty = !(this.board[to] & 4);

		//if spawnCell doesn't have a player on it
		if (spawnCellEmpty) this.addMove(from, to);
	}
}

Leap.prototype.getMovesInDirection = function (from, direction) {
	//check adjacent cells of piece p wrt the boundary
	const adj = from+direction;
	const isPhase = this.board[adj] & 1;
	const jumpWithinBounds = Math.abs( (adj+direction)%BOARD_SIZE - from%BOARD_SIZE ) < 3;
	if (isPhase) this.canLeap(from, adj);

	if ( (this.getPlayer(adj) ^ this.turn) === 8 ) {
		if (jumpWithinBounds) this.canJump(from, direction);
 	}
	else this.addMove(from, adj);
}

Leap.prototype.getMoves = function (from) {
	const bCol = (from+1)%BOARD_SIZE < 2 ? (from+1)%BOARD_SIZE : undefined;
	for (let r=-1; r<2; r++) {
		for (let c=-1+(bCol === 1 ? 1 : 0); c<2-(bCol === 0 ? 1 : 0); c++) {
			let direction = (r*BOARD_SIZE) + c;
			let adj = from+direction;
			let validDirection = (direction) && ( this.getPlayer(adj) ^ this.turn ) && this.inBounds(adj);
			if ( validDirection ) this.getMovesInDirection(from, direction);
		}
	}
	const inv = this.getInverseIndex(from);
	// phase condition
	if ( !this.isRedundantMove(from, inv) ) this.canPhase(from, inv);
	// clone condition
	if (!(this.board[from] & 16) && this.onCloningCell(from) ) this.getSpawnCells(from);
}

Leap.prototype.getAllMoves = function (player) {
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
Leap.prototype.doMove = function (from, to) {
	//CACHE this.board HERE. ITS A VERY HOT FUNCTION lmao (. Y .)
	if (this.isCloneMove(from, to)) {
		this.makeClone(from, to);
		this.removeHighlight();
		this.clearMoves();
		this.switchPlayer();
		this.continuedMove = false;
		return;
	}
	const pi = this.board[from] >> 5;
	const capturedPiece = this.getCapturedPiece(pi, to);
	this.removeHighlight();
	this.clearMoves();

	const piece = (pi << 5) | (this.board[from] & 16) | this.turn;

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


		if( (--this.pAmount[(this.turn ^ 8)]) === 0) return true;
		//if Leap, then we get the direction by the difference between captured index and adjacent movement cell
		const capturedAdjToDestination = (-9 <= (to-capturedPiece) && (to-capturedPiece) <= 9);
		const capturedDirection = capturedAdjToDestination ? (to-capturedPiece) : (capturedPiece - from);
		//if can continue move in direction
		let adj = to+capturedDirection;
		if ( this.board[adj] & 1 ) this.canLeap(to, adj);
		if ( (this.getPlayer(adj) ^ this.turn) === 8) this.canJump(to, capturedDirection);
	}
	this.board[from] &= 3; //keep only cell data
	this.board[BOARD_AREA + pi] = to;

	const canPhase = (this.board[to] & 1) && !this.isPhaseMove(from, to, capturedPiece);
	const canClone = this.onCloningCell(to) && !this.onCloningCell(from);
	//If can clone or is on phase that piece hasn't just travelled through
	if (canPhase) this.canPhase(to, this.getInverseIndex(to));
	if (canClone)	this.getSpawnCells(to);

	//if not a continued move, change player
	if(!this.moves[pi].length) this.switchPlayer();
	else {this.continuedMove = to;/*debugger;*/}

	return false;
}

/*==========											REFERENCES												==========*/

Leap.prototype.getPlayer = function (index) {
	const pid = (this.board[index] & 12);
	return (pid === 4 || pid === 12) ? pid : 0;
}
//NOTE: index 0 can never be captured
//How to optimize? Well, if moves[pid][i] !< BOARD_AREA, then it must be a capture

Leap.prototype.getCapturedPiece = function (pid, to) {
	const nMoves = this.moves[pid].length;
	for (let i=0; i< nMoves; i++) {
		let move = this.moves[pid][i];
		let capturedPiece = move >> (BIT_INDEX_SHIFT);
		if (capturedPiece >= BOARD_AREA) debugger;
		if ( (move & (BIT_AREA - 1)) === to  && capturedPiece) return capturedPiece;
	}
}

//ONLY WORKS on NxN boards and phase group orders of 2
Leap.prototype.getInverseIndex = function (index) {
	return (BOARD_AREA - 1) - index;
}

Leap.prototype.getConfig = () => ({
  'BOARD_SIZE': BOARD_SIZE,
  'BOARD_AREA': BOARD_AREA,
  'BIT_SIZE': BIT_SIZE,
});

/*==========											UTILITY														==========*/

Leap.prototype.inBounds = function (index) {
	return 0 <= index && index < BOARD_AREA;
}

Leap.prototype.switchPlayer = function () {
	this.turn ^= 8;
	this.continuedMove = false;
	return this.turn;
}

Leap.prototype.isRedundantMove = function (from, to) {
	const pi = (this.board[from] >> 5);
	const n = this.moves[pi].length;
	for (let i=0; i<n; i++) {
		if ( (this.moves[pi][i] & (BIT_AREA-1)) === to ) return true;
	}
	return false;
}

Leap.prototype.validMove = function (piece, index) {
	const n = this.moves[piece].length;
	for (let i=0; i<n; i++) {
		if ( (this.moves[piece][i] & (BIT_AREA - 1)) === index ) return true;
	}
	return false;
}

//not sure how performant this is...
Leap.prototype.randomMove = function () {
	if (!this.continuedMove) {
		//if no moves, enemy wins
		if (!this.getAllMoves(this.turn)) return (this.turn ^ 8);

		//There's gotta be a better way to remove undefined indeces
		const moves = {...this.moves};
		const reducedMoveList = Object.keys(moves)
			.filter( item => moves[item].length)
			.reduce( (res, key) => (res[key] = moves[key], res), {} );
		const moveKeys = Object.keys(reducedMoveList);
		const length = moveKeys.length;
		const piece = moveKeys[Math.floor(Math.random() * length)];
		const to = reducedMoveList[piece][Math.floor(Math.random() * reducedMoveList[piece].length)] & (BIT_AREA - 1);
		const from = this.board[BOARD_AREA + parseInt(piece)];

		return (this.doMove(from, to)) ? this.turn : 0;
	} else {

		this.clearMoves();
		const from = this.continuedMove;
		this.getMoves(from);
		const pi = this.board[from] >> 5;
		const to = this.moves[pi][Math.floor(Math.random() * this.moves[pi].length)] & (BIT_AREA - 1);
		return (this.doMove(from, to)) ? this.turn : 0;
	}
}

//what should the heuristic be??
Leap.prototype.score = function () {
	let p1 = 0;
	let p2 = 0;
	const spawnRow = index => ( (index >> 5) & BIT_MAX_PI ) ? (BOARD_SIZE-1) : 0;

	//no piece difference...
	if ( (this.pAmount[PLAYER_ONE] - this.pAmount[PLAYER_TWO]) === 0 ) {
		for (let key=0; key<2*BIT_MAX_PI && (this.board[BOARD_AREA + key] !== undefined);key++) {
			const piece = this.board[BOARD_AREA + key];
			const distanceFromSpawn = Math.abs(spawnRow(piece) - piece/BOARD_SIZE);
			if (key < BIT_MAX_PI) p1 += distanceFromSpawn;
			else p2 += distanceFromSpawn;
		}
	} else {
		const p = {...this.board.slice(BOARD_AREA)};
		const pieces = Object.keys(p)
			.filter( item => p[item] !== undefined)
			.reduce( (res, key) => (res[key] = p[key], res), {} );
		const n = Object.keys(pieces).length;
		for (let pi in pieces) {
			const isClone = 2*(pieces[pi] & 16);
			const score = (5+!isClone);
			if (parseInt(pi)/BIT_MAX_PI) p2 += score;
			else p1 += score;
		}
	}
	if (p1 > p2) return PLAYER_ONE;
	else if (p2 > p1) return PLAYER_TWO;
	else return 0;
}

export default Leap;
