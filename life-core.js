// TODO: Add reset feture
var LifeCore = (function () {
	function LifeCore(width, height) {
		assert(width > 0 && height > 0, "Invalid grid size (" + width + "x" + height + ").");
		this.width = width;
		this.height = height;
		console.log("Life on grid " + width + "x" + height + ".");

		this.generation = 1;
		// TODO: Add population counter
		//this.population = 0;

		this.cells = new Array(this.width);
		for (var x = 0; x < this.width; ++x)
			this.cells[x] = new Array(this.height);

		// Buffer for next-generation cells
		this.buffer = new Array(this.width);
		for (var x = 0; x < this.width; ++x)
			this.buffer[x] = new Array(this.height);

		/*
		 * Initial fill
		 *
		 *    o o o
		 *    o   o
		 *    o   o
		 */
		var xmid = this.width / 2;
		var ymid = this.height / 2;

		this.cells[xmid - 1][ymid - 1] = 1;
		this.cells[xmid    ][ymid - 1] = 1;
		this.cells[xmid + 1][ymid - 1] = 1;

		this.cells[xmid - 1][ymid    ] = 1;
		this.cells[xmid + 1][ymid    ] = 1;

		this.cells[xmid - 1][ymid + 1] = 1;
		this.cells[xmid + 1][ymid + 1] = 1;
	}

	// Fot compatability with life-core-2.js
	LifeCore.prototype.getCurrentbuffer = function () {
		return this.cells;
	}

	LifeCore.prototype.x = function (x) {
		var newx = x % this.width;
		if (newx < 0)
			newx = this.width + newx;
		return newx;
	}

	LifeCore.prototype.y = function (y) {
		var newy = y % this.height;
		if (newy < 0)
			newy = this.height + newy;
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
		for (var x = 0; x < this.width; ++x) {
			for (var y = 0; y < this.height; ++y) {
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