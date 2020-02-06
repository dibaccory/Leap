
export const CELL_COLORS = [ "gray1", "gray2", "pink", "red", "orange", "yellow", "green", "blue"];

export const phaseLayouts = {
	[0]: [ 17, 41,	26, 34,		19, 43,		20, 44,		29, 37, 	22, 46] // spaced by column for some reason?
};

export const cellType = index => {
	let type;
	switch (true) {
		case (index === 17) || (index === 41):
			type = 2;
			break;
		case (index === 26) || (index === 34):
			type = 3;
			break;
		case (index === 19) || (index === 43):
			type = 4;
			break;
		case (index === 20) || (index === 44):
			type = 5;
			break;
		case (index === 29) || (index === 37):
			type = 6;
			break;
		case (index === 22) || (index === 46):
			type = 7;
			break;
		default:
			type = (index % 2) ? 1 : 0;
			break;
	}
	return type;
}
//
// module.exports.inBounds = function (row, col) {
// 	return ((row > -1 && row < 8) && (col > -1 && col < 8));
// }
