
module.exports.cell_type = function (row, col) {
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

module.exports.in_bounds = function (row, col) {
	return ((row > -1 && row < 8) && (col > -1 && col < 8));
}
