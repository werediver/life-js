var LifeCore = (function () {
	function LifeCore(nx, ny) {
		assert(nx >= 0 || ny >= 0, "Invalid grid size (" + nx + "x" + ny + ").");
		this.nx = nx;
		this.ny = ny;
		console.log("Creating grid " + nx + "x" + ny + " cell(s).");

		this.generation = 1;
		// TODO: Add population counter
		//this.population = 0;

		this.cells = new Array(this.nx);
		for (var col = 0, colmax = this.nx; col < colmax; ++col)
			this.cells[col] = new Array(this.ny);

		// Buffer for next-generation cells
		this.buffer = new Array(this.nx);
		for (var col = 0, colmax = this.nx; col < colmax; ++col)
			this.buffer[col] = new Array(this.ny);

		/*
		 * Initial fill
		 *
		 *    o o o
		 *    o   o
		 *    o   o
		 */
		var xmid = this.nx / 2;
		var ymid = this.ny / 2;

		this.cells[xmid - 1][ymid - 1] = 1;
		this.cells[xmid    ][ymid - 1] = 1;
		this.cells[xmid + 1][ymid - 1] = 1;

		this.cells[xmid - 1][ymid    ] = 1;
		this.cells[xmid + 1][ymid    ] = 1;

		this.cells[xmid - 1][ymid + 1] = 1;
		this.cells[xmid + 1][ymid + 1] = 1;
	}

	LifeCore.prototype.xplus = function (x, dx) {
		var newx = (x + dx) % this.nx;
		if (newx < 0)
			newx = this.nx + newx;
		return newx;
	}

	LifeCore.prototype.yplus = function (y, dy) {
		var newy = (y + dy) % this.ny;
		if (newy < 0)
			newy = this.ny + newy;
		return newy;
	}

	LifeCore.prototype.isAlive = function (x, y) {
		return this.cells[x][y] == 1;
	}

	LifeCore.prototype.countNeighbours = function (x, y) {
		var count = 0;

		if (this.isAlive(this.xplus(x, -1), this.yplus(y, -1)))
			++count;
		if (this.isAlive(x,                 this.yplus(y, -1)))
			++count;
		if (this.isAlive(this.xplus(x,  1), this.yplus(y, -1)))
			++count;

		if (this.isAlive(this.xplus(x, -1), y))
			++count;
		if (this.isAlive(this.xplus(x,  1), y))
			++count;

		if (this.isAlive(this.xplus(x, -1), this.yplus(y, 1)))
			++count;
		if (this.isAlive(x,                 this.yplus(y, 1)))
			++count;
		if (this.isAlive(this.xplus(x,  1), this.yplus(y, 1)))
			++count;

		return count;
	}

	LifeCore.prototype.step = function () {
		for (var col = 0, colmax = this.cells.length; col < colmax; ++col) {
			for (var row = 0, rowmax = this.cells[col].length; row < rowmax; ++row) {
				var n = this.countNeighbours(col, row);
				if (this.isAlive(col, row)) {
					if (n == 2 || n == 3)
						this.buffer[col][row] = 1;
					else
						this.buffer[col][row] = 0;
				} else {
					if (n == 3)
						this.buffer[col][row] = 1;
					else
						// Ensure there is be no garbage from previous steps
						this.buffer[col][row] = 0;
				}
			}
		}

		var tmp = this.cells;
		this.cells = this.buffer;
		this.buffer = tmp;

		++this.generation;
	}

	return LifeCore;
})();