var Life = (function () {
	function Life(canvasId, cellSize) {
		var canvas = document.getElementById(canvasId);
		assert(canvas != null);

		this.graphics = new LifeGraphics(canvas, cellSize);

		var nx = Math.floor(canvas.width  / cellSize);
		var ny = Math.floor(canvas.height / cellSize);
		this.core = new LifeCore(nx, ny);

		this.freqMeter = new FreqMeter(10);

		this.status = this.STATUS.PAUSED;

		this.updateInfoCallback = function () {};
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
		this.freqMeter.tick();
		this.updateInfoCallback();
	}

	Life.prototype.play = function (maxperf) {
		var _this = this;
		this.status = this.STATUS.PLAYING;
		this.loopTimerId = setInterval(function () {
			if (_this.status == _this.STATUS.PLAYING)
				_this.step()
			else
				clearInterval(_this.loopTimerId);
		}, maxperf ? 1 : 1000 / 5);
	}

	Life.prototype.pause = function () {
		clearInterval(this.loopTimerId);
		this.status = this.STATUS.PAUSED;
		this.freqMeter.reset();
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
	life = new Life("life-canvas", 10);
	life.refresh();

	var ui = {
		// Buttons
		play:      document.getElementById("life-play"),
		randomize: document.getElementById("life-randomize"),
		reset:     document.getElementById("life-reset"),

		// Checkbox
		maxperf: document.getElementById("life-maxperf"),

		// Labels
		generation: document.getElementById("life-generation"),
		population: document.getElementById("life-population"),
		fps:        document.getElementById("life-fps"),
	}

	ui.play.addEventListener("click", function () {
		if (life.status == life.STATUS.PAUSED) {
			ui.play.innerHTML = "Pause";
			life.play(ui.maxperf.checked);
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

	ui.maxperf.addEventListener("click", function () {
		if (life.status == life.STATUS.PLAYING) {
			life.pause();
			life.play(ui.maxperf.checked);
		}
	})

	life.updateInfoCallback = function () {
		ui.generation.innerHTML = life.core.generation;
		ui.population.innerHTML = life.core.population;
		ui.fps.innerHTML        = life.freqMeter.freq.toFixed(1);
	}
}