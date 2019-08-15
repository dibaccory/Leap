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
	this.board = this.fill_board(this.init_board(size));
	this.p1 = p1;
	this.p2 = p2;
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
    return white_pieces.concat(black_pieces);
}

Board.prototype.fill_board = function(board) {
	let size = board.length;
	for(let i=0; i<size; i++) {
		board[7][i] = i;			//white pieces
		board[0][i] = 8 + i;	//black pieces
	}
	return board;
}

Board.prototype.update = function () {
	for(let [i, row] of this.board.entries()) {
		//if board[pieces[cell].row][pieces[cell].col] == and !pieces[cell].removed

		//if piece[cell] at different location than on board
		row.map((cell, j) => {
			let p = cell != null ? this.pieces[cell] : null;
			if(this.board[p.row][p.col] == this.board[i][j])
		};
	}
};

/*
Board.prototype.clone_piece(p) {
	p.isCloned = true;
}


Board.prototype.is_this_jump = function(piece, row) {
	return Math.abs(this.pieces[piece].row - row) === 2;
}
*/


Board.prototype.make_clone = function(p, row, col) {
	this.pieces[p].cloned = true;
	//TODO: UPDATE BOARD function. get piece index from html? idk lol

	//row will only be 0 or 7, so we can use this to determine player and placement
	return (row) ? this.pieces.unshift({player: this.p1, cloned: true, row: row, col: col, removed: false})
	 						 : this.pieces.push({player: this.p2, cloned: true, row: row, col: col, removed: false});
}

Board.prototype.can_clone = function(piece_i) {
	let p = this.pieces[piece_i];
	return (!p.cloned && (p.player == this.p1 && !p.row) || (p.player == this.p2 && p.row == 7));
}

Board.prototype.get_player = function(piece_i) {
	return this.pieces[piece_i].player;
}

//Player has no more moves when (1): all player's pieces are removed (2): every piece has no moves
Board.prototype.has_moves = function(player) {
	for(let i=0; i < this.pieces.length) {
		let piece = this.pieces[i];
		if(!piece.removed && piece.player == player) {
			if(!this.get_moves(i).every(t => t == [] || t == {} || t = null)) return true;
		}
	}
	return false;
}

Board.prototype.valid_move = function(piece_i, row, col) {
	let m = this.get_moves(piece_i);
	let moves = [];
	moves = moves.concat(m.phase, m.adjs, m.jumps, m.leaps);
		for (let type in moves) {
			for (let move of type) {
				if (move.row == row && move.col == col) return true;
			}
		}
	return false;
}

Board.prototype.can_continue = function(piece_i) {
	let moves = this.get_moves(piece_i);
	return !moves.every(t => t == [] || t == {} || t = null);
}

Board.prototype.do_move = function(p, row, col) {
	let c = this.pieces[p];
	this.board[c.row][c.col] = null;
	c.row = row;
	c.col = col;
	this.board[row][col] = p;

	//TODO: if there is a captured piece, remove from this.board and this.pieces[capt_piece].removed = true



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

Board.prototype.get_moves = function(piece) {
	let adjs = [];
	let phase = {};
	let jumps = [];
	let leaps = [];
	let p = this.pieces[piece];


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
						leaps.push({row: 7 - p.row, col: 7 - p.col, captured: capt});
					}
				}

				if(cell_adj) {	//if adj cell occupied, jump_cell in bounds, jump_cell clear, and jump_cell has enemy piece
					if(in_bounds(p.row + r*2, p.col + c*2) && !this.board[p.row + r*2][p.col + c*2]
					&& this.get_player(cell_adj) != p.player) {
							jumps.push({row: row  + r*2, col: p.col + c*2, captured: cell_adj});
					}
				} else adjs.push({row: row + r, col: col + c});	//adjacent moves
			}
		}
	}

	return {phase: phase, adjs: adjs, jumps: jumps, leaps: leaps};
}


module.exports = Board;
