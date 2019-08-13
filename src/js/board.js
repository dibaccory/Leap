function Board(size, p1, p2) {
	this.board = this.fill_board(this.init_board(size));
	this.p1 = p1;
	this.p2 = p2;
	this.checkers = this.init_pieces(size, p1, p2);
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
*/

Board.prototype.getAllMoves = function(player) {
	let moves = {jumps: [], singles: []};
	let checkers = this.checkers;
	checkers.forEach((checker, i) => {
		if (checker.player == player && !checker.removed) {
			let cMoves = this.getMoves(i);
			moves.jumps = (moves.jumps).concat(cMoves.jumps);
			moves.singles = (moves.singles).concat(cMoves.singles);
		}
	});
	console.log("moves: " + JSON.stringify(moves));
	return moves;
}

Board.prototype.hasMoves = function(player) {
	let moves = this.getAllMoves(player);
	return moves.jumps.length + moves.singles.length > 0;
}


Board.prototype.canMoveChecker = function(checker, row, col) {
	let player = this.checkers[checker].player;
	let moves = this.getAllMoves(player);
	let movesToCheck = moves.jumps.length ? moves.jumps : moves.singles;
		for (let move of movesToCheck) {
			if (move.row === row && move.col === col) {
				return true;
			}
		}
	return false;
}

Board.prototype.isJumpMove = function(checker, row) {
	return Math.abs(this.checkers[checker].row - row) === 2;
}

Board.prototype.canKeepJumping = function(checker) {
	let moves = this.getMoves(checker).jumps;
	console.log(JSON.stringify(moves));
	if (moves.length) {
		return true;
	}
	return false;
}

Board.prototype.makeKing = function(checker) {
	let c = this.checkers[checker];
	c.isKing = true;
}

Board.prototype.isKing = function(checker) {
	let c = this.checkers[checker];
	return c.isKing;
}

Board.prototype.getPlayer = function(checker) {
	let c = this.checkers[checker];
	return c.player;
}

Board.prototype.moveChecker = function (checker, row, col) {
	let c = this.checkers[checker];
	let cRow = c.row;
	let cCol = c.col;
	if (this.isJumpMove(checker, row)) {
		let midRow = (cRow + row) / 2;
		let midCol = (cCol + col) / 2;
		let removedPlayer = this.board[midRow][midCol];
		this.board[midRow][midCol] = null;
		this.checkers[removedPlayer].removed = true;
	}
	c.row = row;
	c.col = col;
	this.board[cRow][cCol] = null;
	this.board[row][col] = checker;
}

Board.prototype.getMoves = function(checker) {
	let singles = [];
	let switches = [];
	let jumps = [];
	let super_jumps = [];
	let c = this.checkers[checker];

	//single, switch, jump, super-jump
	/*
	single: adjacent
	switch: change portal side
	super-jump: capture piece while jumping through a portal
	jitch: jump, then switch
	swump: switch, then jump
	}
	*/

	return {singles: singles, jumps: jumps};
}

Board.prototype.checkAdjacent = function(row, left, right) {
	let moves = [];
	if (row >= this.board.length || row < 0) {
		return moves;
	}
	if (this.board[row][left] === null) {
		moves.push({row: row, col: left});
	}
	if (this.board[row][right] === null) {
		moves.push({row: row, col: right});
	}
	return moves;
}

Board.prototype.checkJumps = function(row, nextRow, left, right, nextLeft, nextRight, player) {
	let moves = [];
	if (row >= this.board.length || row < 0 || nextRow >= this.board.length ||
		nextRow < 0
		) {
		return moves;
	}
	let adjacent = this.board[row][left];
	if (adjacent != null && this.checkers[adjacent].player !== player) {
		if (this.board[nextRow][nextLeft] === null) {
			moves.push({row: nextRow, col: nextLeft});
		}
	}
	adjacent = this.board[row][right];
	if (adjacent != null && this.checkers[adjacent].player !== player) {
		if (this.board[nextRow][nextRight] === null) {
			moves.push({row: nextRow, col: nextRight});
		}
	}
	return moves;
}


module.exports = Board;
