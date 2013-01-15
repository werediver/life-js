var LifeGraphics = (function () {
	function LifeGraphics(canvas, cellSize, newCellColor, oldCellColor, indicateAge) {
		this.canvas  = canvas;
		this.context = canvas.getContext("2d");

		// Cell size should be at least 3 px: 1 px border and 1 px body.
		assert(cellSize > 2, "Invalid cell size (" + cellSize + " px).");
		this.cellSize = cellSize;

		this.newCellColor = newCellColor;
		this.oldCellColor = oldCellColor;

		this.indicateAge = indicateAge;

		// While new cell is of newCellColor, cell older than maxCellAge is of oldCellColor.
		this.maxCellAge = 10;

		this.xoffset = Math.round((this.canvas.width  % this.cellSize) / 2);
		this.yoffset = Math.round((this.canvas.height % this.cellSize) / 2);
	}

	LifeGraphics.prototype.drawGrid = function () {
		var w = this.canvas.width;
		var h = this.canvas.height;

		var context = this.context;

		context.fillStyle = "#FFFFFF";
		context.fillRect(0, 0, w, h);

		context.strokeStyle = "#F0F0F0";
		context.beginPath();

		// Draw vertical lines
		for (var x = this.xoffset; x <= w; x += this.cellSize) {
			context.moveTo(x, 0);
			context.lineTo(x, h);
		}

		// Draw horizontal lines
		for (var y = this.yoffset; y <= h; y += this.cellSize) {
			context.moveTo(0, y);
			context.lineTo(w, y);
		}

		context.stroke();
	};

	LifeGraphics.prototype.drawCells = function (core) {
		var dgrid = core.dgrid;
		for (var col = 0; col < dgrid.width; ++col) {
			for (var row = 0; row < dgrid.height; ++row) {
				var cell = dgrid.get(col, row);
				if (cell > 0) {
					if (this.indicateAge) {
						this.context.fillStyle = interpolateColor(
							this.newCellColor,
							this.oldCellColor,
							Math.min((cell - 1) / this.maxCellAge, 1)
						);
					} else
						this.context.fillStyle = this.newCellColor;
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
	};

	LifeGraphics.prototype.draw = function (core) {
		//this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawGrid();
		this.drawCells(core);
	};

	return LifeGraphics;
})();
