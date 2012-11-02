// TODO: Add FPS counter
// TODO: Add manual population feature
// TODO: Add speed control
var Life = (function () {
	function Life(canvasId, cellSize) {
		this.canvas = document.getElementById(canvasId);
		assert(this.canvas != null, "Can't find element by id '" + canvasId + "'.");

		this.graphics = new LifeGraphics(this.canvas, cellSize);

		var nx = Math.floor(this.canvas.width  / cellSize);
		var ny = Math.floor(this.canvas.height / cellSize);
		this.core = new LifeCore(nx, ny);

		this.status = this.STATUS.PAUSED;
	}

	Life.prototype.STATUS = {
		PLAYING: "PLAYING",
		PAUSED:  "PAUSED"
	}

	Life.prototype.refresh = function () {
		this.graphics.draw(this.core);
	}

	Life.prototype.loop = function () {
		//console.log("Generation: " + this.core.generation);
		//console.log("Population: " + this.core.population);
		this.refresh();
		this.core.step();
	}

	Life.prototype.startLoop = function () {
		var _this = this;
		this.status = this.STATUS.PLAYING;
		this.loopTimerId = setInterval(function () {
			if (_this.status == _this.STATUS.PLAYING)
				_this.loop()
			else
				clearInterval(_this.loopTimerId);
		}, 1000 / 5);
	}

	Life.prototype.stopLoop = function () {
		this.status = this.STATUS.PAUSED;
	}

	return Life;
})();

var life = null;

function init() {
	life = new Life("lifecanvas", 10);
	life.refresh();

	var play = document.getElementById("play");
	play.addEventListener("click", function () {
		if (life.status == life.STATUS.PLAYING) {
			play.innerHTML = "Play";
			life.stopLoop();
		} else {
			play.innerHTML = "Pause";
			life.startLoop();
		}
	});

	var randomize = document.getElementById("randomize");
	randomize.addEventListener("click", function () {
		life.core.reset();
		life.core.populateRandom(0.2);
		life.refresh();
	});

	var reset = document.getElementById("reset");
	reset.addEventListener("click", function () {
		life.stopLoop();
		life.core.reset();
		life.core.populateDefault();
		life.refresh();
	});
}