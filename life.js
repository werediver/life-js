// TODO: разделить модель "жизни" и отрисовку
var LifeGrid = (function () {
	function LifeGrid(canvasId, cellSize) {
		this.canvas = document.getElementById(canvasId);
		this.context = this.canvas.getContext("2d");

		this.cellSize = cellSize;

		this.xcount = this.canvas.width  / this.cellSize;
		this.ycount = this.canvas.height / this.cellSize;

		this.cells = new Array(this.xcount);
		for (var col in this.cells)
			this.cells[col] = new Array(this.ycount);
	}

	LifeGrid.prototype.drawGrid = function () {
		var w = this.canvas.width;
		var h = this.canvas.height;
		var xoffset = (w % this.cellSize) / 2;
		var yoffset = (h % this.cellSize) / 2;

		this.context.strokeStyle = "#F0F0F0";
		this.context.beginPath();

		// Draw vertical lines
		for (var x = xoffset; x <= w; x += this.cellSize) {
			this.context.moveTo(x, 0);
			this.context.lineTo(x, h);
		}

		// Draw horizontal lines
		for (var y = yoffset; y <= h; y += this.cellSize) {
			this.context.moveTo(0, y);
			this.context.lineTo(w, y);
		}

		this.context.stroke();
	}

	LifeGrid.prototype.drawCells = function () {
		// ...
	}

	LifeGrid.prototype.draw = function () {
		this.drawGrid();
		this.drawCells();
	}

	return LifeGrid;
})();

var grid = null;

function init() {
	grid = new LifeGrid("lifecanvas", 10);
	grid.draw();
}
