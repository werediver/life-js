function componentToHex(x) {
    var hex = x.toString(16);
    return hex.length == 2 ? hex : '0' + hex;
}

function hexColorFromComponents(components) {
	var r = components[0];
	var g = components[1];
	var b = components[2];
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexColorToComponents(hexColor) {
	var re = /#([0-9A-F]{1,2})([0-9A-F]{2})([0-9A-F]{2})/i;
	var tokens = re.exec(hexColor);

	var r = parseInt(tokens[1], 16);
	var g = parseInt(tokens[2], 16);
	var b = parseInt(tokens[3], 16);

	return [r, g, b];
}

function hexColorAdd(hexColor, extra, bounds) {
	var components = hexColorToComponents(hexColor);
	for (var i = 0; i < 3; ++i) {
		var x = components[i] + extra[i];
		var xMin = bounds[i][0];
		var xMax = bounds[i][1];

		if (x > xMax)
			x = xMax;
		else if (x < xMin)
			x = xMin;

		components[i] = x;
	}
	return hexColorFromComponents(components);
}

function colorBounds(dark, light) {
	var components1 = hexColorToComponents(dark);
	var components2 = hexColorToComponents(light);
	return [[components1[0], components2[0]],
			[components1[1], components2[1]],
			[components1[2], components2[2]]];
}

var LifeGraphics = (function () {
	function LifeGraphics(canvas, cellSize) {
		this.canvas  = canvas;
		this.context = canvas.getContext("2d");

		// Cell size should be at least 3 px: 1 px border and 1 px body.
		assert(cellSize > 2, "Invalid cell size (" + cellSize + " px).");
		this.cellSize = cellSize;

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
		// TODO: _Optionally_ show cell age through change of the color.
		//this.context.fillStyle = "#80F080";
		var fillColor = "#80F080";
		var bounds = colorBounds("#60A060", "#FFFFFF");
		var dgrid = core.dgrid;
		for (var col = 0; col < dgrid.width; ++col) {
			for (var row = 0; row < dgrid.height; ++row) {
				var cell = dgrid.get(col, row);
				if (cell > 0) {
					this.context.fillStyle = hexColorAdd(fillColor, [-cell * 10, -cell * 10, -cell * 10], bounds);
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
