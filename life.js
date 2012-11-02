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

		this.updateInfoCallback = function () {};
		this.updateFpsCallback  = function () {};
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
		this.updateInfoCallback();
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
		life.pause();
		life.core.reset();
		life.core.populateRandom(0.2);
		life.refresh();
		this.updateInfoCallback();
	}

	Life.prototype.reset = function () {
		life.pause();
		life.core.reset();
		life.core.populateDefault();
		life.refresh();
		this.updateInfoCallback();
	}

	return Life;
})();

var life = null;

function init() {
	life = new Life("lifecanvas", 10);
	life.refresh();

	var ui = {
		// Buttons
		play:      document.getElementById("play"),
		randomize: document.getElementById("randomize"),
		reset:     document.getElementById("reset"),

		// Labels
		generation: document.getElementById("generation"),
		population: document.getElementById("population"),
		fps:        document.getElementById("fps"),
	}

	ui.play.addEventListener("click", function () {
		if (life.status == life.STATUS.PAUSED) {
			ui.play.innerHTML = "Pause";
			life.play();
		} else {
			ui.play.innerHTML = "Play";
			life.pause();
		}
	});

	ui.randomize.addEventListener("click", function () {
		life.randomize();
		ui.play.innerHTML = "Play";
	});

	ui.reset.addEventListener("click", function () {
		life.reset();
		ui.play.innerHTML = "Play";
	});

	life.updateInfoCallback = function () {
		ui.generation.innerHTML = life.core.generation;
		ui.population.innerHTML = life.core.population;
	}
}