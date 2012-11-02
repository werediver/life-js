// TODO: Add reset feture

// Double buffered grid based on single-dimensional arrays
var DoubleGrid = (function () {
	function DoubleGrid(width, height) {
		this.width  = width;
		this.height = height;

		this.buffer1 = new Array(width * height);
		this.buffer2 = new Array(width * height);
	}

	DoubleGrid.prototype.swap = function () {
		var tmp = this.buffer1;
		this.buffer1 = this.buffer2;
		this.buffer2 = tmp;
	}

	DoubleGrid.prototype.get = function (x, y) {
		return this.buffer1[this.width * x + y];
	}

	DoubleGrid.prototype.set = function (x, y, val) {
		this.buffer2[this.width * x + y] = val;
	}

	// Special cases of coordinate translation

	DoubleGrid.prototype.decx = function (x) {
		return --x >= 0 ? x : this.width - 1;
	}

	DoubleGrid.prototype.incx = function (x) {
		return ++x < this.width ? x : 0;
	}

	DoubleGrid.prototype.decy = function (y) {
		return --y >= 0 ? y : this.height - 1;
	}

	DoubleGrid.prototype.incy = function (y) {
		return ++y < this.height ? y : 0;
	}

	return DoubleGrid;
})();

var LifeCore = (function () {
	function LifeCore(width, height) {
		console.log("Life on grid " + width + "x" + height + ".");

		this.dgrid = new DoubleGrid(width, height);

		this.populateDefault();
	}

	LifeCore.prototype.populateDefault = function () {
		/*
		 * Put this figure in the center of the grid:
		 *     o o o
		 *     o   o
		 *     o   o
		 */
		var dgrid = this.dgrid;
		var xmid = dgrid.width  / 2;
		var ymid = dgrid.height / 2;

		dgrid.set(xmid - 1, ymid - 1, 1);
		dgrid.set(xmid    , ymid - 1, 1);
		dgrid.set(xmid + 1, ymid - 1, 1);

		dgrid.set(xmid - 1, ymid,     1);
		dgrid.set(xmid + 1, ymid,     1);

		dgrid.set(xmid - 1, ymid + 1, 1);
		dgrid.set(xmid + 1, ymid + 1, 1);

		dgrid.swap();
	}

	LifeCore.prototype.populateRandom = function () {
		// TODO: Implement.
	}

	LifeCore.prototype.newCell = function () {
		return 1;
	}

	LifeCore.prototype.isAlive = function (cell) {
		return cell > 0;
	}

	LifeCore.prototype.countNeighbours = function (x, y) {
		var count = 0, dgrid = this.dgrid;
		var _x = dgrid.decx(x), x_ = dgrid.incx(x);
		var _y = dgrid.decy(y), y_ = dgrid.incy(y);

		if (this.isAlive(dgrid.get(_x, _y)))
			++count;
		if (this.isAlive(dgrid.get(_x, y)))
			++count;
		if (this.isAlive(dgrid.get(_x, y_)))
			++count;

		if (this.isAlive(dgrid.get(x, _y)))
			++count;
		if (this.isAlive(dgrid.get(x, y_)))
			++count;

		if (this.isAlive(dgrid.get(x_, _y)))
			++count;
		if (this.isAlive(dgrid.get(x_, y)))
			++count;
		if (this.isAlive(dgrid.get(x_, y_)))
			++count;

		return count;
	}

	LifeCore.prototype.step = function () {
		var dgrid = this.dgrid;
		var w = dgrid.width;
		var h = dgrid.height;
		for (var x = 0; x < w; ++x) {
			for (var y = 0; y < h; ++y) {
				var n = this.countNeighbours(x, y);
				var cell = dgrid.get(x, y);
				if (this.isAlive(cell)) {
					if (n == 2 || n == 3)
						dgrid.set(x, y, ++cell);
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
	}

	return LifeCore;
})();