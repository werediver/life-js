// Double buffered grid based on single-dimensional arrays.
// Rows are stored consequently.
var DoubleGrid = (function () {
	function DoubleGrid(width, height) {
		this.width  = width;
		this.height = height;

		this.buffer1 = new Array(width * height);
		this.buffer2 = new Array(width * height);
	}

	DoubleGrid.prototype.reset = function () {
		var key;
		for (key in this.buffer1)
			delete this.buffer1[key];
		for (key in this.buffer2)
			delete this.buffer2[key];
	};

	DoubleGrid.prototype.swap = function () {
		var tmp = this.buffer1;
		this.buffer1 = this.buffer2;
		this.buffer2 = tmp;
	};

	DoubleGrid.prototype.get = function (x, y) {
		return this.buffer1[y * this.width + x];
	};

	DoubleGrid.prototype.set = function (x, y, val) {
		this.buffer2[y * this.width + x] = val;
	};

	// Special cases of coordinate translation

	DoubleGrid.prototype.decx = function (x) {
		return --x >= 0 ? x : this.width - 1;
	};

	DoubleGrid.prototype.incx = function (x) {
		return ++x < this.width ? x : 0;
	};

	DoubleGrid.prototype.decy = function (y) {
		return --y >= 0 ? y : this.height - 1;
	};

	DoubleGrid.prototype.incy = function (y) {
		return ++y < this.height ? y : 0;
	};

	return DoubleGrid;
})();

var LifeCore = (function () {
	function LifeCore(width, height) {
		console.log("Life on grid " + width + "x" + height + ".");

		this.dgrid = new DoubleGrid(width, height);
		this.generation = 1;
		this.population = 0;

		this.populateDefault();
	}

	LifeCore.prototype.reset = function () {
		this.dgrid.reset();
		this.generation = 1;
		this.population = 0;
	};

	// Note: step() updates population count automatically.
	LifeCore.prototype.updatePopulationCount = function () {
		var count = 0, buffer = this.dgrid.buffer1;
		for (var key in buffer)
			if (this.isCellAlive(buffer[key]))
				++count;
		this.population = count;
	};

	LifeCore.prototype.populateDefault = function () {
		/*
		 * Put this figure in the center of the grid:
		 *     o o o
		 *     o   o
		 *     o   o
		 */

		var dgrid = this.dgrid;
		var xmid = Math.round(dgrid.width  / 2);
		var ymid = Math.round(dgrid.height / 2);

		// Assuming the grid is big enough

		dgrid.set(xmid - 1, ymid - 1, this.newCell());
		dgrid.set(xmid    , ymid - 1, this.newCell());
		dgrid.set(xmid + 1, ymid - 1, this.newCell());

		dgrid.set(xmid - 1, ymid,     this.newCell());
		dgrid.set(xmid + 1, ymid,     this.newCell());

		dgrid.set(xmid - 1, ymid + 1, this.newCell());
		dgrid.set(xmid + 1, ymid + 1, this.newCell());

		dgrid.swap();

		this.updatePopulationCount();
	};

	LifeCore.prototype.populateRandom = function (fillFactor) {
		var dgrid = this.dgrid;
		var w = dgrid.width, h = dgrid.height;
		for (var n = w * h * fillFactor; n > 0; --n) {
			var x = Math.round((w - 1) * Math.random());
			var y = Math.round((h - 1) * Math.random());
			dgrid.set(x, y, this.newCell());
		}
		dgrid.swap();
		this.updatePopulationCount();
	};

	LifeCore.prototype.newCell = function () {
		return 1;
	};

	LifeCore.prototype.isCellAlive = function (cell) {
		return cell > 0;
	};

	LifeCore.prototype.incCellAge = function (cell) {
		return ++cell;
	};

	LifeCore.prototype.countNeighbours = function (x, y) {
		var count = 0, dgrid = this.dgrid;
		var _x = dgrid.decx(x), x_ = dgrid.incx(x);
		var _y = dgrid.decy(y), y_ = dgrid.incy(y);

		if (this.isCellAlive(dgrid.get(_x, _y)))
			++count;
		if (this.isCellAlive(dgrid.get(_x, y)))
			++count;
		if (this.isCellAlive(dgrid.get(_x, y_)))
			++count;

		if (this.isCellAlive(dgrid.get(x, _y)))
			++count;
		if (this.isCellAlive(dgrid.get(x, y_)))
			++count;

		if (this.isCellAlive(dgrid.get(x_, _y)))
			++count;
		if (this.isCellAlive(dgrid.get(x_, y)))
			++count;
		if (this.isCellAlive(dgrid.get(x_, y_)))
			++count;

		return count;
	};

	LifeCore.prototype.step = function () {
		var dgrid = this.dgrid;
		var w = dgrid.width;
		var h = dgrid.height;
		var count = 0;	// new population count
		for (var x = 0; x < w; ++x) {
			for (var y = 0; y < h; ++y) {
				var n = this.countNeighbours(x, y);
				var cell = dgrid.get(x, y);
				if (this.isCellAlive(cell)) {
					++count;
					if (n == 2 || n == 3)
						dgrid.set(x, y, this.incCellAge(cell));
					else
						dgrid.set(x, y, 0);
				} else {
					if (n == 3)
						dgrid.set(x, y, this.newCell());
					else
						// Ensure there is be no garbage from previous steps
						dgrid.set(x, y, 0);
				}
			}
		}
		this.dgrid.swap();
		this.population = count;
		++this.generation;
	};

	return LifeCore;
})();
