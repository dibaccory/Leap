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

Board.prototype.init_pieces = function(size, p1, p2) {
	let white_pieces = 0;
	let black_pieces = 0;
	for (let i = 0; i < size; i++) {
		white_pieces.push({player: p1, cloned: false, row: 0, col: 1, removed: false});
		black_pieces.push({player: p2, cloned: false, row: 7, col: 1, removed: false});
	}
    return white_pieces.concat(black_pieces);
}

Board.prototype.fill_board = function(board) {
	let size = board.length;
	for(let i=0; i<size; i++) {
		board[0][i] = i;			//black pieces
		board[7][i] = 8 + i;	//white pieces
	}
	return board;
}
/*
Board.prototype.clone_piece(p) {
	p.isCloned = true;
}


Board.prototype.is_this_jump = function(piece, row) {
	return Math.abs(this.pieces[piece].row - row) === 2;
}
*/

Board.prototype.make_clone = function(piece) {
	let c = this.pieces[piece];
	c.is_clone = true;
}

Board.prototype.is_clone = function(piece) {
	let c = this.pieces[piece];
	return c.is_clone;
}

Board.prototype.get_player = function(piece) {
	let c = this.pieces[piece];
	return c.player ? c.player : null;
}

Board.prototype.get_all_moves = function(player) {
	let moves = {jumps: [], adjs: []};
	let pieces = this.pieces;
	pieces.forEach((piece, i) => {
		if (piece.player == player && !piece.removed) {
			let cMoves = this.get_moves(i);
			moves.jumps = (moves.jumps).concat(cMoves.jumps);
			moves.adjs = (moves.adjs).concat(cMoves.adjs);
		}
	});
	console.log("moves: " + JSON.stringify(moves));
	return moves;
}

Board.prototype.has_moves = function(player) {
	let moves = this.get_all_moves(player);
	return moves.jumps.length + moves.adjs.length > 0;
}

Board.prototype.can_move = function(piece, row, col) {
	let player = this.pieces[piece].player;
	let moves = this.get_all_moves(player); //why get all moves????
	let movesToCheck = moves.jumps.length ? moves.jumps : moves.adjs;
		for (let move of movesToCheck) {
			if (move.row === row && move.col === col) {
				return true;
			}
		}
	return false;
}

Board.prototype.can_continue = function(piece) {
	let moves = this.get_moves(piece).jumps;
	console.log(JSON.stringify(moves));
	if (moves.length) {
		return true;
	}
	return false;
}

Board.prototype.do_move = function (piece, row, col) {
	let c = this.pieces[piece];
	let cRow = c.row;
	let cCol = c.col;

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
	c.row = row;
	c.col = col;
	this.board[cRow][cCol] = null;
	this.board[row][col] = piece;
}

Board.prototype.get_moves = function(piece) {
	let adjs = [];
	let phase;
	let jumps = [];
	let leaps = [];
	let p = this.pieces[piece];

	//single, phase, jump, super-jump
	/*
	adj: adjacent
	phase: change portal side
	leap: capture piece while jumping through a portal
	jitch: jump, then phase
	swump: switch, then jump
	}
	*/
	if(cell_type(p.row, p.col) > 1 && !this.board[7 - p.row][7 - p.col]) phase = {row: 7 - p.row, col: 7 - p.col};

	for(let r=-1;r<2;r++) {
		for(let c=-1;c<2;c++) {
			if(in_bounds(p.row + r, p.col + c)) {
				let neighbor_cell = this.board[p.row + r][p.col + r];
				if(cell_type(p.row + r, p.col + c) > 1 && !this.board[7 - p.row][7 - p.col]) { //if phase adj and end destination is empty
					let p_on_adj_phase = neighbor_cell;
					let p_on_far_phase = this.board[7 - (p.row + r)][7 - (p.col + r)];
					//if(p_on_adj_phase && p_on_far_phase)
					leaps.push(this.get_leap());
				}
				/*
				adj: !neighbor_cell
				jump: neighbor_cell && is_bounds(jump place) && neighbor_cell.player != p.player
				leap: neighbor_cell
				*/
				if(neighbor_cell) {	//if adj cell occupied

					if(in_bounds(p.row + r*2, p.col + c*2)) {
						if(!this.board[p.row + r*2][p.col + c*2]
						&& this.get_player(this.board[p.row + r][p.col + c]) != p.player) { //if there is an enemy piece adjacent to this one
						jumps.push({row: row  + r*2, col: p.col + c*2, captured = });
					}
				} else adjs.push({row: row + r, col: col + c});	//adjacent moves

			}
		}
	}

	return {adjs: adjs, jumps: jumps};
}

Board.prototype.get_jump = function(p, row_inc, col_inc) {
	if(in_bounds(p.row + r*2, p.col + c*2) && !this.board[p.row + r][p.col + c]) {


	}

	return moves;
}


module.exports = Board;
