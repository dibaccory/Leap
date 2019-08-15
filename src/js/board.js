//single, phase, jump, super-jump
/*
adj: adjacent
phase: change portal side
leap: capture piece while jumping through a portal
jitch: jump, then phase
swump: switch, then jump
}
*/

function cell_type(row, col) {
	let type;
	switch true {
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

Board.prototype.init_board = function(size) {
    let b = [];

    for (let i = 0; i < size; i++) {
      b.push(Array(size).fill(null));
    }
    return b;
}

Board.prototype.init_pieces = function(size) {
	let white_pieces = [];
	let black_pieces = [];
	for (let i = 0; i < size; i++) {
		white_pieces.push({player: this.p1, cloned: false, row: 7, col: 1, removed: false});
		black_pieces.push({player: this.p2, cloned: false, row: 0, col: 1, removed: false});
	}
		this.update_board(); //add pieces to board
    return white_pieces.concat(black_pieces);
}

Board.prototype.update_board = function () {
	this.board.map(row => row.map((cell, j) =>
		cell != null ? (this.pieces[cell].removed ? null : this.pieces[cell]) : null ));
}

//Calls every time a clone is made
Board.prototype.insert_at_seperation_index = function() {
	for(let pi=this.pieces_separator; pi<this.pieces.length; pi++) {
		//Finds index that seperates p1 and p2 pieces
		if(this.pieces[pi].player != this.p1) {
			this.pieces_separator = pi; //update
			return pi;
		}
	}
}

Board.prototype.make_clone = function(pi, row, col) {
	this.pieces[pi].cloned = true;
	//row will only be 0 or 7, so we can use this to determine player and placement
	let player = row ? this.p1, this.p2;
	let clone = {player: player, cloned: true, row: row, col: col, removed: false};
	return this.pieces.splice(this.insert_at_seperation_index(),0, clone);
}

Board.prototype.can_clone = function(pi) {
	let p = this.pieces[pi];
	return (!p.cloned && (p.player == this.p1 && !p.row) || (p.player == this.p2 && p.row == 7));
}

Board.prototype.get_player = function(pi) {
	return this.pieces[pi].player;
}

Board.prototype.can_continue = function(pi) {
	let moves = this.get_moves(pi);
	return !moves.every(t => t == [] || t == {} || t = null);
}

//Player has no more moves when (1): all player's pieces are removed (2): every piece has no moves
Board.prototype.has_moves = function(player) {
	for(let pi=0; pi < this.pieces.length; pi++) {
		let p = this.pieces[pi];
		if(!p.removed && p.player == player) {
			if(this.can_continue(pi)) return true;
		}
	}
	return false;
}

Board.prototype.valid_move = function(pi, row, col) {
	let m = this.get_moves(pi);
	let moves = [];
	moves = moves.concat(m.phase, m.adjs, m.jumps, m.leaps);
		for (let type in moves) {
			for (let move of type) {
				if (move.row == row && move.col == col) return true;
			}
		}
	return false;
}



Board.prototype.do_move = function(pi, row, col) {
	let c = this.pieces[pi];
	this.board[c.row][c.col] = null;
	c.row = row;
	c.col = col;
	this.board[row][col] = pi;

	//TODO: if there is a captured piece, remove from this.board and this.pieces[capt_piece].removed = true

	//let captured = this.pieces[c.captured_pi]


	//check if
	/*
	if (this.is_this_jump(piece, row)) {
		let midRow = (c.row + row) / 2;
		let midCol = (c.col + col) / 2;
		let removedPlayer = this.board[midRow][midCol];
		this.board[midRow][midCol] = null;
		this.pieces[removedPlayer].removed = true;
	}
	*/

}

Board.prototype.get_moves = function(pi) {
	let adjs = [];
	let phase = {};
	let jumps = [];
	let leaps = [];
	let p = this.pieces[pi];


	if(cell_type(p.row, p.col) > 1 && !this.board[7 - p.row][7 - p.col]) phase = {row: 7 - p.row, col: 7 - p.col};

	for(let r=-1;r<2;r++) {
		for(let c=-1;c<2; c++) {
			//check within boundaries and ignore the middle
			if(in_bounds(p.row + r, p.col + c) && (r || c)) {
				let cell_adj = this.board[p.row + r][p.col + r];
				let is_phase = cell_type(p.row + r, p.col + c) > 1;

				//if neighbor cell is a phase, leap_cell clear, and (enemy piece on phase_adj XOR enemy piece on phase_far)
				if(is_phase && !this.board[7 - p.row][7 - p.col]) {
					let phase_adj = cell_adj;
					let phase_far = this.board[7 - (p.row + r)][7 - (p.col + r)];

					if((phase_adj || phase_far) && !(phase_adj && phase_far)) {
						let capt = phase_adj ? phase_adj : phase_far;
						leaps.push({row: 7 - p.row, col: 7 - p.col, captured_pi: capt});
					}
				}

				if(cell_adj) {	//if adj cell occupied, jump_cell in bounds, jump_cell clear, and jump_cell has enemy piece
					if(in_bounds(p.row + r*2, p.col + c*2) && !this.board[p.row + r*2][p.col + c*2]
					&& this.get_player(cell_adj) != p.player) {
							jumps.push({row: row  + r*2, col: p.col + c*2, captured_pi: cell_adj});
					}
				} else adjs.push({row: row + r, col: col + c});	//adjacent moves
			}
		}
	}

	return {phase: phase, adjs: adjs, jumps: jumps, leaps: leaps};
}


module.exports = Board;
