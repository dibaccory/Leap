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
 represent each of this.state.selected_piece's moves as a boolean for 'highlight' in
 this.board[row][col] = {who: p.player | null, highlight: true | false :: added in Board.get_moves(pi)}
 for some row,col,  and p = this.piece[pi]
 to Leap.set_piece(), add this.state.board.update_board()

*/


function Board(size, p1, p2) {
	this.p1 = p1;
	this.p2 = p2;
	this.board = this.init_board(size);
	this.pieces_separator = 8;
	this.pieces = this.init_pieces(size, p1, p2);
	this.update_board(); //add pieces to board
}

//TODO:
//this.board[row][col] = {who: p.player | null, highlight: {row: some_row, col: some_col} | null:: added in Board.get_moves(pi)}
//update occurs when (1) piece is cloned (pieces index may change)
// and when (2) set_piece is called
//To make highlight function properly, I'll have to call this.get_moves() from here.
//It follows that I will have to remove other calls to this.get_moves()
Board.prototype.update_board = function (new_piece) {
	if (new_piece) {
		this.board = this.board.map(row => row.map((cell, j) => {
			if (cell.who != null) { //increment all pi in board after pieces_separator by one
				if (cell.who >= this.pieces_separator) cell.who++;
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

Board.prototype.init_board = function (size) {
    let board = [], player_two = [], player_one = [];
		//TODO: fill as {who: pi (this.pieces index), highlight: null}
		for (let i = 0; i < size; i++) {
			player_two.push({who: i, move: false});
			player_one.push({who: i+8, move: false});
		}
		board.push(player_two);
		for (let i = 1; i < size-1; i++) board.push(Array(size).fill({who: null, move: false}));
		board.push(player_one);

    return board;
}

Board.prototype.init_pieces = function (size) {
	let white_pieces = [];
	let black_pieces = [];
	for (let c = 0; c < size; c++) {
		white_pieces.push({player: this.p1, cloned: false, row: 7, col: c, alive: true});
		black_pieces.push({player: this.p2, cloned: false, row: 0, col: c, alive: true});
	}
    return black_pieces.concat(white_pieces);
}

/*==========											CLONE															==========*/

//Calls every time a clone is made
Board.prototype.insert_at_separation_index = function () {
	for(let pi=this.pieces_separator; pi<this.pieces.length; pi++) {
		//Finds index that separates p1 and p2 pieces
		if(this.pieces[pi].player !== this.p2) {
			this.pieces_separator = pi; //update
			return pi;
		}
	}
}

Board.prototype.make_clone = function (pi, row, col) {
	let p = this.pieces[pi];
	p.cloned = true;
	let clone = {player: p.player, cloned: true, row: row, col: col, alive: true};
	this.pieces.splice(this.insert_at_separation_index(),0, clone); //add clone to pieces Array
	this.update_board(true);
	this.board[row][col].who = this.pieces_separator;
	return true;
}

Board.prototype.can_clone = function (pi) {
	let p = this.pieces[pi];
	return (!p.cloned && p.col < 7 && p.col > 0 && ( (p.player === this.p1 && !p.row) || (p.player === this.p2 && p.row === 7) ));
}

Board.prototype.is_clone_spawn = function (pi, row, col) {
	return this.can_clone(pi) && this.board[row][col].who === null;
}

/*==========											MOVES															==========*/

Board.prototype.get_player = function (pi) {
	return this.pieces[pi].player;
}

Board.prototype.is_leap = function (p, row_incr, col_incr, is_phase, cell_adj, bypass_condition) {
	//if neighbor cell is a phase, leap_cell clear, and (enemy piece on phase_adj XOR enemy piece on phase_far)
	let destination_cell = this.board[7 - p.row][7 - p.col];
	if(is_phase && !destination_cell.who) {
		let phase_adj = cell_adj.who;
		let phase_far = this.board[7 - (p.row + row_incr)][7 - (p.col + col_incr)].who;
		if((phase_adj || phase_far) && !(phase_adj && phase_far)) { //xor filter. Only one may be true
			let capt = phase_adj ? phase_adj : phase_far;
			//if 0, add to destination_cell.move, if 1,
			if (bypass_condition) return true;
			else destination_cell.move = capt;
		}
	}
}

Board.prototype.is_jump = function (p, row_incr, col_incr, cell_adj, bypass_condition) {
	//if adj cell occupied, jump_cell in bounds, jump_cell clear, and jump_cell has enemy piece
	if(util.in_bounds(p.row + row_incr*2, p.col + col_incr*2)) {
		let destination_cell = this.board[p.row + row_incr*2][p.col + col_incr*2];
		if (this.get_player(cell_adj.who) !== p.player && destination_cell.who === null) {
			if(bypass_condition%3) return true;
			else destination_cell.move = cell_adj.who;
		}
	}
}

Board.prototype.is_phase = function (p, bypass_condition) {
	let is_phase = util.cell_type(p.row, p.col) > 1;
	let destination_cell = this.board[7 - p.row][7 - p.col];
	if(is_phase && destination_cell.who === null) {
		if (bypass_condition%3) return true;
		else destination_cell.move = true;
	}
}

Board.prototype.get_clone_spawns = function (p, bypass_condition) {
	let row = p.player === this.p1 ? 7 : 0;
	let clone_spawns = [];
	for(let col=1; col<7;col++) {
		let destination_cell = this.board[row][col];
		if (destination_cell.who === null) {
			if (bypass_condition%3) return true;
			else destination_cell.move = true;
		}
	}
}

Board.prototype.get_moves_in_direction = function (p, bypass_condition, r, c) {
	//check adjacent cells of piece p wrt the boundary
	if(util.in_bounds(p.row + r, p.col + c) && (r || c)) {
		let cell_adj = this.board[p.row + r][p.col + c];
		let is_phase = util.cell_type(p.row + r, p.col + c) > 1;

		if (this.is_leap(p, r, c, is_phase, cell_adj, bypass_condition)) return true;
		if (cell_adj.who !== null) {
			if (this.is_jump(p, r, c, cell_adj, bypass_condition)) return true;
		}
		else if (bypass_condition%3%2) return true;	//adjacent moves
		else if (!bypass_condition) cell_adj.move = true;
	}
	return false;
}

//bypass_condition (HIGHLIGHT BYPASS CONDITION): undefined - default (Store all), 1 - bypass all, 2 - bypass continuable moves, 3 - store continuable moves
Board.prototype.get_moves = function (pi, bypass_condition, r, c) {

	let p = this.pieces[pi];
	//TODO: ref this.board[p.row + r][p.col + r].who, and set highlight = true for every destination
	if (this.is_phase(p, bypass_condition)) return true;
	if (this.can_clone(pi) && this.get_clone_spawns(p, bypass_condition)) return true;

	if (r != null && c != null) {
		if (this.get_moves_in_direction(p, bypass_condition, r, c)) return true;
	} else {
		for(r=-1;r<2;r++) for(c=-1;c<2; c++) {
			if (this.get_moves_in_direction(p, bypass_condition, r, c)) return true;
		}
	}

	return false;
}

//Performs move. returns true if caught piece in process, else false
Board.prototype.do_move = function (pi, row, col) {
	let p = this.pieces[pi];
	//begin move
	this.board[p.row][p.col].who = null;

	let destination_cell = this.board[row][col];
	let caught = typeof(destination_cell.move) === "number" ? destination_cell.move : false; //caught piece index
	// move_direction is defined if and only if any of the following is true (for moving piece p):
	let move_direction;
		// (1) p caught a piece
	if (caught) {
		let c = this.pieces[caught];
		c.alive = false;
		this.board[c.row][c.col].who = null;
		//return direction of move
		//If leap, then c adjacent at start XOR c adjacent at end
		//Check adjacency of moving piece to captured piece on starting position and ending position
		let c_adj_start = Math.abs(c.row - p.row) < 2 && Math.abs(c.col - p.col) < 2;
		let c_adj_end = Math.abs(row - c.row) < 2 && Math.abs(col - c.col) < 2;

		move_direction = (c_adj_start && c_adj_end)
			? {row_incr: Math.sign(row-c.row), col_incr: Math.sign(col-c.col)}	//jump
			: (c_adj_start
				? {row_incr: Math.sign(c.row-p.row), col_incr: Math.sign(c.col-p.row)}	//leap-> piece adj to capture on start
				: {row_incr: Math.sign(row-c.row), col_incr: Math.sign(col-c.col)});
	}	// (2) p LANDS on a phase cell. That is, this move is not a phase.
	else if (!this.same_phase(p,{row: row, col: col}))	move_direction = {row_incr: 0, col_incr: 0};

	//end move
	this.board[row][col].who = pi;
	p.row = row;
	p.col = col;

		// (3) p is able to be cloned
	if (this.can_clone(pi)) move_direction = {row_incr: 0, col_incr:0};
	this.update_board();
	return move_direction;
}

/*==========											INTEGRITY													==========*/

Board.prototype.same_phase = function (from, to) {
	let is_destination_phase = util.cell_type(to.row, to.col);
	return is_destination_phase > 1 && is_destination_phase === util.cell_type(from.row, from.col);
}

Board.prototype.can_continue_move = function (pi, dir) {

	return dir ? this.get_moves(pi, 2, dir.row_incr, dir.col_incr) : false;
}

Board.prototype.has_moves = function (pi) {
	return this.get_moves(pi, 1);
}

//Player has no more moves when (1): all player's pieces are dead (2): every piece has no moves
Board.prototype.moves_left = function (player) {
	for(let pi=0; pi < this.pieces.length; pi++) {
		let p = this.pieces[pi];
		if(p.alive && p.player === player) {
			if(this.has_moves(pi)) return true;
		}
	}
	return false;
}

Board.prototype.valid_move = function (row, col) {
	return this.board[row][col].move;
}

module.exports = Board;
