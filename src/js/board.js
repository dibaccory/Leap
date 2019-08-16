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

function cell_type(row, col) {
	let type;
	switch (true) {
		case (row == 1 && col == 2) || (row == 6 && col == 5):
			type = 2;
			break;
		case (row == 3 && col == 2) || (row == 4 && col == 5):
			type = 3;
			break;
		case (row == 4 && col == 2) || (row == 3 && col == 5):
			type = 4;
			break;
		case (row == 5 && col == 3) || (row == 2 && col == 4):
			type = 5;
			break;
		case (row == 5 && col == 4) || (row == 2 && col == 3):
			type = 6;
			break;
		case (row == 6 && col == 2) || (row == 1 && col == 5):
			type = 7;
			break;
		default:
			type = (row + col) % 2 == 0 ? 0 : 1;
			break;
	}
	return type;
}

function in_bounds(row, col) {
	return ((row > -1 || row < 8) && (col > -1 || col < 8));
}

function Board(size, p1, p2) {
	this.board = this.init_board(size);
	this.p1 = p1;
	this.p2 = p2;
	this.pieces_separator = 8;
	this.pieces = this.init_pieces(size, p1, p2);
}

//TODO:
//this.board[row][col] = {who: p.player | null, highlight: {row: some_row, col: some_col} | null:: added in Board.get_moves(pi)}
//update occurs when (1) piece is cloned (pieces index may change)
// and when (2) set_piece is called
//To make highlight function properly, I'll have to call this.get_moves() from here.
//It follows that I will have to remove other calls to this.get_moves()
Board.prototype.update_board = function () {
	this.board.map(row => row.map((cell, j) =>
		cell !== null ? (this.pieces[cell].alive ? this.pieces[cell] : null) : null ));
}

Board.prototype.init_board = function (size) {
    let b = [];
    for (let i = 0; i < size; i++) b.push(Array(size).fill(null));
    return b;
}

Board.prototype.init_pieces = function (size) {
	let white_pieces = [];
	let black_pieces = [];
	for (let i = 0; i < size; i++) {
		white_pieces.push({player: this.p1, cloned: false, row: 7, col: 1, alive: true});
		black_pieces.push({player: this.p2, cloned: false, row: 0, col: 1, alive: true});
	}i
		this.update_board(); //add pieces to board
    return white_pieces.concat(black_pieces);
}

/*==========											CLONE															==========*/

//Calls every time a clone is made
Board.prototype.insert_at_separation_index = function () {
	for(let pi=this.pieces_separator; pi<this.pieces.length; pi++) {
		//Finds index that separates p1 and p2 pieces
		if(this.pieces[pi].player != this.p1) {
			this.pieces_separator = pi; //update
			return pi;
		}
	}
}

Board.prototype.make_clone = function (pi, row, col) {
	this.pieces[pi].cloned = true;
	//row will only be 0 or 7, so we can use this to determine player and placement
	let player = row ? this.p1 : this.p2;
	let clone = {player: player, cloned: true, row: row, col: col, alive: true};
	return this.pieces.splice(this.insert_at_separation_index(),0, clone);
}

Board.prototype.can_clone = function (pi) {
	let p = this.pieces[pi];
	return (!p.cloned && ( (p.player == this.p1 && !p.row) || (p.player == this.p2 && p.row == 7) ));
}

/*==========											MOVES															==========*/

Board.prototype.get_player = function (pi) {
	return this.pieces[pi].player;
}

Board.prototype.is_leap = function (p, row_incr, col_incr) {
	//if neighbor cell is a phase, leap_cell clear, and (enemy piece on phase_adj XOR enemy piece on phase_far)
	if(is_phase && !this.board[7 - p.row][7 - p.col]) {
		let phase_adj = cell_adj;
		let phase_far = this.board[7 - (p.row + row_incr)][7 - (p.col + col_incr)];
		if((phase_adj || phase_far) && !(phase_adj && phase_far)) { //xor filter. Only one may be true
			let capt = phase_adj ? phase_adj : phase_far;
			return {row: 7 - p.row, col: 7 - p.col, captured_pi: capt};
		}
	}
}

Board.prototype.is_jump = function (p, row_incr, col_incr) {
	//if adj cell occupied, jump_cell in bounds, jump_cell clear, and jump_cell has enemy piece
	if(in_bounds(p.row + row_incr*2, p.col + col_incr*2)) {
		if (this.get_player(cell_adj) != p.player && !this.board[p.row + row_incr*2][p.col + col_incr*2]) {
				return {row: row  + row_incr*2, col: p.col + col_incr*2, captured_pi: cell_adj};
		}
	}
}

Board.prototype.is_phase = function (p) {
	let is_phase = cell_type(p.row, p.col) > 1;
	if(is_phase && !this.board[7 - p.row][7 - p.col]) return {row: 7 - p.row, col: 7 - p.col};
}

Board.prototype.is_clone_spawn = function (p) {
	let spawn_row = p.player == this.p1 ? this.board[0] : this.board[7];

	let clone_spawns = [];
	for(let cell=1; cell<7;cell++) {
		if (spawn_row[cell] === null) clone_spawns.push(spawn_row[cell]);
	}
	return clone_spawns;
}

Board.prototype.get_moves = function (pi) {
	let adjs = [], jumps = [], leaps = [];
	let p = this.pieces[pi];

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
	 this.board[row][col] = {who: p.player | null, highlight: {row: some_row, col: some_col} | null:: added in Board.get_moves(pi)}
	 for some row,col,  and p = this.piece[pi]
	 to Leap.set_piece(), add this.state.board.update_board()

	*/

	let phase, jump, leap;
	for(let r=-1;r<2;r++) {
		for(let c=-1;c<2; c++) {
			//check adjacent cells of piece p wrt the boundary
			if(in_bounds(p.row + r, p.col + c) && (r || c)) {
				let cell_adj = this.board[p.row + r][p.col + r];
				let is_phase = cell_type(p.row + r, p.col + c) > 1;

				leap = this.can_leap(p, r, c);
				if(cell_adj) jump = this.can_jump(p, r, c);
				else adjs.push({row: row + r, col: col + c});	//adjacent moves

				//add key: clone_spawn for ANY move resulting in can_clone == true


				if (leap !== undefined) leaps.push(leap);
				if (jump !== undefined) jumps.push(jump);
				if (phase !== undefined) phase = this.can_phase(p);
			}
		}
	}

	let piece_moves = {phase: phase, adjs: adjs, jumps: jumps, leaps: leaps};
	if (this.can_clone(pi)) {
		let clone_spawns = this.is_clone_spawn(p);
		if (clone_spawns.length) piece_moves.clone_spawns = clone_spawns;
	}
	return piece_moves;
}

//Performs move. returns true if captured piece in process, else false
Board.prototype.do_move = function (pi, row, col) {
	let p = this.pieces[pi];
	this.board[p.row][p.col] = null;
	this.board[row][col] = pi;
	p.row = row;
	p.col = col;

	//if piece p contains captured piece
	let c = p.captured_pi !== undefined ? this.pieces[p.captured_pi] : null;
	if (c) {
		c.alive = false;
		this.board[c.row][c.col] = null;
		return true;
	}
	return false;
}

/*==========											INTEGRITY													==========*/

Board.prototype.can_continue_turn = function (pi) {
	let moves = this.get_moves(pi);
	moves.adjs = [];
	//return !parseInt(Object.values(a).reduce( (j,i) => i.length !== undefined ? i.length + j: j));
	return !moves.every(t => t == [] || t == {} || t == null);
}

Board.prototype.has_moves = function (pi) {
	let moves = this.get_moves(pi);
	//return !parseInt(Object.values(a).reduce( (j,i) => i.length !== undefined ? i.length + j: j));
	return !moves.every(t => t == [] || t == {} || t == null);
}

//Player has no more moves when (1): all player's pieces are dead (2): every piece has no moves
Board.prototype.moves_left = function (player) {
	for(let pi=0; pi < this.pieces.length; pi++) {
		let p = this.pieces[pi];
		if(p.alive && p.player == player) {
			if(this.has_moves(pi)) return true;
		}
	}
	return false;
}

Board.prototype.valid_move = function (pi, row, col) {
	let m = this.get_moves(pi); //** this.board[row][col].highlight
	let moves = [];
	moves = moves.concat(m.phase, m.adjs, m.jumps, m.leaps);
		for (let type in moves) {
			for (let move of type) {
				if (move.row == row && move.col == col) return true;
			}
		}
	return false;
}

module.exports = Board;
