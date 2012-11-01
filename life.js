// TODO: Add state (play/pause)
// TODO: Add reset feture
// TODO: Add random population feature
// TODO: Add manual population feature
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