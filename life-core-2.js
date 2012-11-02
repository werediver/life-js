// TODO: Add reset feture
var Grid = (function () {
	function Grid(width, height) {
		this.width  = width;
		this.height = height;

		var buffer = new Array(width);
		for (var col = 0; col < width; ++col)
			buffer[col] = new Array(height);
		this.buffer = buffer;
	}

	// Translates offset to open interval [0..max)
	Grid.prototype.translateOffset = function (offset, max) {
		var correctOffset = offset % max;
		if (correctOffset < 0)
			correctOffset = max + correctOffset;
		return correctOffset;
	}

	// Access via columns may be faster
	Grid.prototype.getColumn = function (x) {
		return this.buffer[this.translateOffset(x, this.width)];
	}

	// Should be pretty slow
	Grid.prototype.getCell = function (x, y) {
		return this.buffer[this.translateOffset(x, this.width)][this.translateOffset(y, this.height)];
	}

	// Should be pretty slow
	Grid.prototype.setCell = function (x, y, cell) {
		this.buffer[this.translateOffset(x, this.width)][this.translateOffset(y, this.height)] = cell;
	}

	return Grid;
})();

var LifeCore = (function () {
	function LifeCore(width, height) {
		console.log("Life on grid " + width + "x" + height + ".");

		this.width  = width;
		this.height = height;

		// Grid for the current generation
		this.grid1 = new Grid(width, height);
		// Grid for the next generation
		this.grid2 = new Grid(width, height);

		this.populateDefault();
	}

	LifeCore.prototype.populateDefault = function () {
		/*
		 *   o o o
		 *   o   o
		 *   o   o
		 */
		var xmid = this.width  / 2;
		var ymid = this.height / 2;
		var buffer = this.getCurrentbuffer();

		buffer[xmid - 1][ymid - 1] = 1;
		buffer[xmid    ][ymid - 1] = 1;
		buffer[xmid + 1][ymid - 1] = 1;

		buffer[xmid - 1][ymid    ] = 1;
		buffer[xmid + 1][ymid    ] = 1;

		buffer[xmid - 1][ymid + 1] = 1;
		buffer[xmid + 1][ymid + 1] = 1;
	}

	LifeCore.prototype.populateRandom = function () {
		// TODO: Implement.
	}

	LifeCore.prototype.swap = function () {
		var tmp = this.grid1;
		this.grid1 = this.grid2;
		this.grid2 = tmp;
	}

	LifeCore.prototype.getCurrentbuffer = function () {
		return this.grid1.buffer;
	}

	LifeCore.prototype.isAlive = function (cell) {
		return cell > 0;
	}

	LifeCore.prototype.newCell = function () {
		return 1;
	}

	LifeCore.prototype.countNeighbours = function (x, y) {
		var count = 0, grid = this.grid1;
		var _y = grid.translateOffset(y - 1, grid.height), y_ = grid.translateOffset(y + 1, grid.height);

		var col = grid.getColumn(x - 1);

		if (this.isAlive(col[_y]))
			++count;
		if (this.isAlive(col[y]))
			++count;
		if (this.isAlive(col[y_]))
			++count;

		col = grid.getColumn(x);
		if (this.isAlive(col[_y]))
			++count;
		if (this.isAlive(col[y_]))
			++count;

		col = grid.getColumn(x + 1);
		if (this.isAlive(col[_y]))
			++count;
		if (this.isAlive(col[y]))
			++count;
		if (this.isAlive(col[y_]))
			++count;

		return count;
	}

	LifeCore.prototype.step = function () {
		var grid1 = this.grid1, grid2 = this.grid2;
		var w = grid1.width, h = grid1.height;
		for (var x = 0; x < w; ++x) {
			var col1 = grid1.getColumn(x);
			var col2 = grid2.getColumn(x);
			for (var y = 0; y < h; ++y) {
				var n = this.countNeighbours(x, y);
				var cell = col1[y];
				if (this.isAlive(cell)) {
					if (n == 2 || n == 3)
						col2[y] = ++cell;
					else
						col2[y] = 0;
				} else {
					if (n == 3)
						col2[y] = this.newCell();
					else
						// Ensure there is be no garbage from previous steps
						col2[y] = 0;
				}
			}
		}
		this.swap();
	}

	return LifeCore;
})();