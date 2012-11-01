var LifeGraphics = (function () {
	function LifeGraphics(canvas, cellSize) {
		this.canvas  = canvas;
		this.context = canvas.getContext("2d");

		// Cell size should be at least 3 px: 1 px border and 1 px body.
		assert(cellSize > 2, "Invalid cell size (" + cellSize + " px).");
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