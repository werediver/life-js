var Life = (function () {
	function Life(canvas) {
		var cellSize = 10;
		var nx = Math.floor(canvas.width  / cellSize);
		var ny = Math.floor(canvas.height / cellSize);
		this.core = new LifeCore(nx, ny);
		this.graphics = new LifeGraphics(canvas, 10, "#80F080", "#D3FA85", true);
		this.painter = new LifePainter(canvas, this.graphics, this.core);

		this.freqMeter = new FreqMeter(10);

		this.status = this.STATUS.PAUSED;
		this.offscreen = false;

		this.updateInfoCallback = function () {};
	}

	Life.prototype.STATUS = {
		PLAYING: "PLAYING",
		PAUSED:  "PAUSED"
	};

	Life.prototype.refresh = function () {
		this.graphics.draw(this.core);
	};

	Life.prototype.step = function () {
		//console.log("Generation: " + this.core.generation);
		//console.log("Population: " + this.core.population);
		this.core.step();
		if (this.offscreen === false)
			this.graphics.draw(this.core);
		this.freqMeter.tick();
		this.updateInfoCallback();
	};

	Life.prototype.play = function (maxperf, offscreen) {
		var _this = this;
		this.status = this.STATUS.PLAYING;
		if (offscreen === true) {
			this.offscreen = true;
			// Off-screen mode impies max. performance.
			maxperf = true;
		} else
			this.offscreen = false;
		this.loopTimerId = setInterval(function () {
			if (_this.status == _this.STATUS.PLAYING)
				_this.step();
			else
				clearInterval(_this.loopTimerId);
		}, maxperf ? 1 : 1000 / 5);
	};

	Life.prototype.pause = function () {
		clearInterval(this.loopTimerId);
		this.status = this.STATUS.PAUSED;
		this.freqMeter.reset();
	};

	Life.prototype.randomize = function () {
		life.pause();
		life.core.reset();
		// The initial density of 37.5% should give the maximal average life
		// http://www.njohnston.ca/2009/07/longevity-in-conways-game-of-life-revisited/
		life.core.populateRandom(0.375);
		life.refresh();
		this.updateInfoCallback();
	};

	Life.prototype.reset = function () {
		life.pause();
		life.core.reset();
		life.core.populateDefault();
		life.refresh();
		this.updateInfoCallback();
	};

	return Life;
})();

function hasCssClass(element, cssClassName) {
	var cssClassNameRegExp = new RegExp("\\b" + cssClassName + "\\b");
	return element.className.search(cssClassNameRegExp) >= 0;
}

function rmCssClass(element, cssClassName) {
	var cssClassNameRegExp = new RegExp("\\b" + cssClassName + "\\b", "g");
	element.className = element.className.replace(cssClassNameRegExp, "").trim();
}

function addCssClass(element, cssClassName) {
	if (!hasCssClass(element, cssClassName))
		element.className = element.className + " " + cssClassName;
}

var life = null;

function init() {
	var ui = {
		canvas: document.getElementById("life-canvas"),

		// Buttons
		play:      document.getElementById("life-play"),
		step:      document.getElementById("life-step"),
		randomize: document.getElementById("life-randomize"),
		reset:     document.getElementById("life-reset"),

		// Checkbox
		indicateAge: document.getElementById("life-indicate-age"),
		maxperf:     document.getElementById("life-maxperf"),
		offscreen:   document.getElementById("life-offscreen"),

		// Labels
		generation: document.getElementById("life-generation"),
		population: document.getElementById("life-population"),
		fps:        document.getElementById("life-fps")
	};

	life = new Life(ui.canvas);
	life.refresh();

	// Shortcuts

	var play = function () {
		life.play(ui.maxperf.checked, ui.offscreen.checked);
	};

	var restart = function () {
		life.pause();
		play();
	};

	var setButtonEnabled = function (element, enabled) {
		if (enabled)
			rmCssClass(element, "life-button-disabled");
		else
			addCssClass(element, "life-button-disabled");
	};

	var isButtonEnabled = function (element) {
		return !hasCssClass(element, "life-button-disabled");
	};

	// UI events handlers

	ui.play.addEventListener("click", function () {
		if (life.status == life.STATUS.PAUSED) {
			setButtonEnabled(ui.step, false);
			ui.play.innerHTML = "Pause";
			play();
		} else {
			setButtonEnabled(ui.step, true);
			ui.play.innerHTML = "Play";
			life.pause();
		}
	});

	ui.step.addEventListener("click", function () {
		if (isButtonEnabled(this)) {
			life.core.step();
			life.refresh();
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

	ui.indicateAge.addEventListener("click", function () {
		life.graphics.indicateAge = this.checked;
		life.refresh();
	});

	ui.maxperf.addEventListener("click", function () {
		if (life.status == life.STATUS.PLAYING)
			restart();
	});

	ui.offscreen.addEventListener("click", function () {
		if (this.checked) {
			ui.maxperf.lastState = ui.maxperf.checked;
			ui.maxperf.checked   = true;
			ui.maxperf.disabled  = true;
		} else {
			if (ui.maxperf.lastState !== undefined) {
				ui.maxperf.checked = ui.maxperf.lastState;
				delete ui.maxperf.lastState;
			}
			ui.maxperf.disabled = false;
		}
		if (life.status == life.STATUS.PLAYING)
			restart();
	});

	life.updateInfoCallback = function () {
		ui.generation.innerHTML = life.core.generation;
		ui.population.innerHTML = life.core.population;
		ui.fps.innerHTML        = life.freqMeter.freq.toFixed(1);
	};
}
