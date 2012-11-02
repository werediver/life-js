// TODO: Add FPS counter
// TODO: Add random population feature
// TODO: Add manual population feature
var Life = (function () {
	function Life(canvasId) {
		var cellSize = 10;	// px

		this.canvas = document.getElementById(canvasId);
		assert(this.canvas != null, "Can't find element by id '" + canvasId + "'.");

		this.graphics = new LifeGraphics(this.canvas, cellSize);

		var nx = this.canvas.width  / cellSize;
		var ny = this.canvas.height / cellSize;
		this.core = new LifeCore(nx, ny);

		this.play = false;
	}

	Life.prototype.loop = function () {
		//console.log("Generation: " + this.core.generation);
		//console.log("Population: " + this.core.population);
		this.graphics.draw(this.core);
		this.core.step();
	}

	Life.prototype.startLoop = function () {
		this.play = true;
		var _this = this;
		setInterval(function () {
			if (_this.play)
				_this.loop()
			else
				clearInterval(this);
		}, 1000 / 5);
	}

	Life.prototype.stopLoop = function () {
		this.play = false;
		//clearInterval(this.loop);
	}

	return Life;
})();

var life = null;

function init() {
	life = new Life("lifecanvas", 10);

	var play = document.getElementById("play");
	play.addEventListener("click", function () {
		if (life.play)
			life.stopLoop();
		else
			life.startLoop();

	});
	var reset = document.getElementById("reset");

	//life.startLoop();
}