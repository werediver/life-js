var LifePainter = (function () {
	function LifePainter(canvas, graphics, core) {
		this.canvas = canvas;
		this.graphics = graphics;
		this.core = core;

		this.lastCol = -1;
		this.lastRow = -1;

		var _this = this;
		canvas.onmousedown = function (e) {_this.mousedown(e);};
		canvas.onmouseup   = function (e) {_this.mouseup(e);};
		canvas.onmousemove = function (e) {_this.mousemove(e);};
	}

	LifePainter.prototype.mousedown = function (e) {
		this.active = true;
		this.mousemove(e);
	};

	LifePainter.prototype.mouseup = function (e) {
		this.active = false;
		this.lastCol = -1;
		this.lastRow = -1;
	};

	LifePainter.prototype.mousemove = function (e) {
		if (this.active) {
			var x = e.pageX - this.canvas.offsetLeft;
			var y = e.pageY - this.canvas.offsetTop;
			this.flipCell(x, y);
		}
	};

	LifePainter.prototype.flipCell = function (x, y) {
		var col = Math.floor(x / this.graphics.cellSize);
		var row = Math.floor(y / this.graphics.cellSize);

		if (this.lastCol != col || this.lastRow != row) {
			var cell = this.core.dgrid.get(col, row);
			this.core.dgrid.setCurrent(col, row, cell ? 0 : 1);
			this.graphics.draw(this.core);

			this.lastCol = col;
			this.lastRow = row;
		}
	};

	return LifePainter;
})();