var LifeCore = (function () {
	function LifeCore(nx, ny) {
		console.log("Creating grid " + nx + "x" + ny + " cell(s).");

		if (nx <= 0 || ny <= 0) {
			console.log("Error. Invalid grid size: " + nx + "x" + ny + " cell(s)");
			return null;
		}
		this.nx = nx;
		this.ny = ny;

		this.generation = 1;

		this.cells = new Array(this.nx);
		for (var col = 0, colmax = this.nx; col < colmax; ++col)
			this.cells[col] = new Array(this.ny);

		// Buffer for next-generation cells
		this.buffer = new Array(this.nx);
		for (var col = 0, colmax = this.nx; col < colmax; ++col)
			this.buffer[col] = new Array(this.ny);

		// Initial fill
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

var LifeGraphics = (function () {
	function LifeGraphics(canvas, cellSize) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		if (this.context == null) {
			console.log("Error. Can't get context from the canvas " + canvas + ".");
			return null;
		}

		if (cellSize <= 0) {
			console.log("Error. Invalid cell size: " + cellSize + " px.");
			return null;
		}
		this.cellSize = cellSize;

		this.xoffset = (this.canvas.width  % this.cellSize) / 2;
		this.yoffset = (this.canvas.height % this.cellSize) / 2;
	}

	LifeGraphics.prototype.drawGrid = function () {
		var w = this.canvas.width;
		var h = this.canvas.height;

		this.context.strokeStyle = "#F0F0F0";
		this.context.beginPath();

		// Draw vertical lines
		for (var x = this.xoffset; x <= w; x += this.cellSize) {
			this.context.moveTo(x, 0);
			this.context.lineTo(x, h);
		}

		// Draw horizontal lines
		for (var y = this.yoffset; y <= h; y += this.cellSize) {
			this.context.moveTo(0, y);
			this.context.lineTo(w, y);
		}

		this.context.stroke();
	}

	LifeGraphics.prototype.drawCells = function (core) {
		this.context.fillStyle = "#80F080";
		for (var col = 0, maxcol = core.cells.length; col < maxcol; ++col) {
			for (var row = 0, maxrow =  core.cells[col].length; row < maxrow; ++row) {
				cell = core.cells[col][row];
				if (cell == 1) {
					// Here is hard-coded 1 px border
					this.context.fillRect(
							this.xoffset + this.cellSize * col + 1,
							this.yoffset + this.cellSize * row + 1,
							this.cellSize - 2,
							this.cellSize - 2
					);
				}
			}
		}
	}

	LifeGraphics.prototype.draw = function (core) {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawGrid();
		this.drawCells(core);
	}

	return LifeGraphics;
})();

var Life = (function () {
	function Life(canvasId) {
		var cellSize = 10;	// px

		this.canvas = document.getElementById(canvasId);
		if (this.canvas == null) {
			console.log("Error. Can't find element by id '" + canvasId + "'.");
			return null;
		}

		this.graphics = new LifeGraphics(this.canvas, cellSize);

		var nx = this.canvas.width  / cellSize;
		var ny = this.canvas.height / cellSize;
		this.core = new LifeCore(nx, ny);
	}

	Life.prototype.loop = function () {
		//console.log("Generation: " + this.core.generation);
		//console.log("Population: " + this.core.population);
		this.graphics.draw(this.core);
		this.core.step();
	}

	Life.prototype.startLoop = function () {
		var _this = this;
		setInterval(function () {_this.loop()}, 1000 / 5);
	}

	Life.prototype.stopLoop = function () {
		clearInterval(this.loop);
	}

	return Life;
})();

var life = null;

function init() {
	life = new Life("lifecanvas", 10);
	life.startLoop();
}