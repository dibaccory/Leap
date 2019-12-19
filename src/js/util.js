module.exports.phaseLayouts = {
	[0]: [ 17, 41,	26, 34,		19, 43,		20, 44,		29, 37, 	22, 46] // spaced by column for some reason?
};


module.exports.cellType = function (row, col) {
	let type;
	switch (true) {
		case (col === 1 && row === 2) || (col === 6 && row === 5):
			type = 2;
			break;
		case (col === 3 && row === 2) || (col === 4 && row === 5):
			type = 3;
			break;
		case (col === 4 && row === 2) || (col === 3 && row === 5):
			type = 4;
			break;
		case (col === 5 && row === 3) || (col === 2 && row === 4):
			type = 5;
			break;
		case (col === 5 && row === 4) || (col === 2 && row === 3):
			type = 6;
			break;
		case (col === 6 && row === 2) || (col === 1 && row === 5):
			type = 7;
			break;
		default:
			type = (row + col) % 2 === 0 ? 0 : 1;
			break;
	}
	return type;
}

module.exports.inBounds = function (row, col) {
	return ((row > -1 && row < 8) && (col > -1 && col < 8));
}
