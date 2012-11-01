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
		for (var x = 0; x < this.nx; ++x)
			this.cells[x] = new Array(this.ny);

		// Buffer for next-generation cells
		this.buffer = new Array(this.nx);
		for (var x = 0; x < this.nx; ++x)
			this.buffer[x] = new Array(this.ny);

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

	LifeCore.prototype.x = function (x) {
		var newx = x % this.nx;
		if (newx < 0)
			newx = this.nx + newx;
		return newx;
	}

	LifeCore.prototype.y = function (y) {
		var newy = y % this.ny;
		if (newy < 0)
			newy = this.ny + newy;
		return newy;
	}

	LifeCore.prototype.isAlive = function (x, y) {
		return this.cells[x][y] == 1;
	}

	LifeCore.prototype.countNeighbours = function (x, y) {
		var count = 0;

		if (this.isAlive(this.x(x - 1), this.y(y - 1)))
			++count;
		if (this.isAlive(x,             this.y(y - 1)))
			++count;
		if (this.isAlive(this.x(x + 1), this.y(y - 1)))
			++count;

		if (this.isAlive(this.x(x - 1), y))
			++count;
		if (this.isAlive(this.x(x + 1), y))
			++count;

		if (this.isAlive(this.x(x - 1), this.y(y + 1)))
			++count;
		if (this.isAlive(x,             this.y(y + 1)))
			++count;
		if (this.isAlive(this.x(x + 1), this.y(y + 1)))
			++count;

		return count;
	}

	LifeCore.prototype.step = function () {
		for (var x = 0; x < this.nx; ++x) {
			for (var y = 0; y < this.ny; ++y) {
				var n = this.countNeighbours(x, y);
				if (this.isAlive(x, y)) {
					if (n == 2 || n == 3)
						this.buffer[x][y] = 1;
					else
						this.buffer[x][y] = 0;
				} else {
					if (n == 3)
						this.buffer[x][y] = 1;
					else
						// Ensure there is be no garbage from previous steps
						this.buffer[x][y] = 0;
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