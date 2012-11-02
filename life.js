// TODO: Add FPS counter
// TODO: Add manual population feature
// TODO: Add speed control
var Life = (function () {
	function Life(canvasId, cellSize) {
		var canvas = document.getElementById(canvasId);
		assert(canvas != null);

		this.graphics = new LifeGraphics(canvas, cellSize);

		var nx = Math.floor(canvas.width  / cellSize);
		var ny = Math.floor(canvas.height / cellSize);
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

	Life.prototype.step = function () {
		//console.log("Generation: " + this.core.generation);
		//console.log("Population: " + this.core.population);
		this.graphics.draw(this.core);
		this.core.step();
	}

	Life.prototype.play = function () {
		var _this = this;
		this.status = this.STATUS.PLAYING;
		this.loopTimerId = setInterval(function () {
			if (_this.status == _this.STATUS.PLAYING)
				_this.step()
			else
				clearInterval(_this.loopTimerId);
		}, 1000 / 5);
	}

	Life.prototype.pause = function () {
		this.status = this.STATUS.PAUSED;
	}

	Life.prototype.randomize = function () {
		life.core.reset();
		life.core.populateRandom(0.2);
		life.refresh();
	}

	Life.prototype.reset = function () {
		life.pause();
		life.core.reset();
		life.core.populateDefault();
		life.refresh();
	}

	return Life;
})();

var life = null;

function init() {
	life = new Life("lifecanvas", 10);
	life.refresh();

	var play = document.getElementById("play");
	play.addEventListener("click", function () {
		if (life.status == life.STATUS.PAUSED) {
			play.innerHTML = "Pause";
			life.play();
		} else {
			play.innerHTML = "Play";
			life.pause();
		}
	});

	var randomize = document.getElementById("randomize");
	randomize.addEventListener("click", function () {
		life.randomize();
	});

	var reset = document.getElementById("reset");
	reset.addEventListener("click", function () {
		life.reset();
	});
}