import LifeGraphics from "LifeGraphics";
import LifePainter from "LifePainter";

enum Status {
    Playing,
    Paused
}

class Life {

    core: LifeCore;
    graphics: LifeGraphics;
    painter: LifePainter;

    loopTimerId = -1;
    freqMeter = new FreqMeter(10);

    status = Status.Paused;
    offscreen = false;

    updateInfoCallback = function () {};

	constructor(canvas: HTMLCanvasElement) {
		const cellSize = 10;
		const nx = Math.floor(canvas.clientWidth  / cellSize);
		const ny = Math.floor(canvas.clientHeight / cellSize);
		this.core = new LifeCore(nx, ny);
		this.graphics = new LifeGraphics(canvas, 10, "#80F080", "#D3FA85", true);
		this.painter = new LifePainter(canvas, this.graphics, this.core);
	}

	refresh() {
		this.graphics.draw(this.core);
	}

	step() {
		//console.log("Generation: " + this.core.generation);
		//console.log("Population: " + this.core.population);
		this.core.step();
		if (this.offscreen === false)
			this.graphics.draw(this.core);
		if (this.status == Status.Playing)
			this.freqMeter.tick();
		this.updateInfoCallback();
	}

	play(maxperf: boolean, offscreen: boolean) {
		let _this = this;
		this.status = Status.Playing;
		if (offscreen === true) {
			this.offscreen = true;
			// Off-screen mode impies max. performance.
			maxperf = true;
		} else {
			this.offscreen = false;
        }
		this.loopTimerId = setInterval(function () {
			if (_this.status == Status.Playing)
				_this.step();
			else {
				clearInterval(_this.loopTimerId);
            }
		}, maxperf ? 1 : 1000 / 5);
	}

	pause() {
		clearInterval(this.loopTimerId);
		this.status = Status.Paused;
		this.freqMeter.reset();
	}

	randomize() {
		this.pause();
		this.core.reset();
		// The initial density of 37.5% should give the maximal average life
		// http://www.njohnston.ca/2009/07/longevity-in-conways-game-of-life-revisited/
		this.core.populateRandom(0.375);
		this.refresh();
		this.updateInfoCallback();
	}

	reset() {
		this.pause();
		this.core.reset();
		this.core.populateDefault();
		this.refresh();
		this.updateInfoCallback();
	}
}

function hasCssClass(element: HTMLElement, cssClassName: string) {
	let cssClassNameRegExp = new RegExp("\\b" + cssClassName + "\\b");
	return element.className.search(cssClassNameRegExp) >= 0;
}

function rmCssClass(element: HTMLElement, cssClassName: string) {
	let cssClassNameRegExp = new RegExp("\\b" + cssClassName + "\\b", "g");
	element.className = element.className.replace(cssClassNameRegExp, "").trim();
}

function addCssClass(element: HTMLElement, cssClassName: string) {
	if (!hasCssClass(element, cssClassName))
		element.className = element.className + " " + cssClassName;
}

let _life: Life | null = null;

interface LastState<T> {
    lastState: T;
}

function init() {
	let ui = {
		canvas: document.getElementById("life-canvas") as HTMLCanvasElement,

		// Buttons
		play:      document.getElementById("life-play")!,
		step:      document.getElementById("life-step")!,
		randomize: document.getElementById("life-randomize")!,
		reset:     document.getElementById("life-reset")!,

		// Checkbox
		indicateAge: document.getElementById("life-indicate-age") as HTMLInputElement,
		maxperf:     document.getElementById("life-maxperf") as HTMLInputElement & LastState<boolean>,
		offscreen:   document.getElementById("life-offscreen") as HTMLInputElement,

		// Labels
		generation: document.getElementById("life-generation")!,
		population: document.getElementById("life-population")!,
		fps:        document.getElementById("life-fps")!
	}

	const life = new Life(ui.canvas);
    _life = life;
	life.refresh();

	// Shortcuts

	let play = function () {
		life.play(ui.maxperf.checked, ui.offscreen.checked);
	}

	let restart = function () {
		life.pause();
		play();
	}

	let setButtonEnabled = function (element: HTMLElement, enabled: boolean) {
		if (enabled)
			rmCssClass(element, "life-button-disabled");
		else
			addCssClass(element, "life-button-disabled");
	}

	let isButtonEnabled = function (element: HTMLElement) {
		return !hasCssClass(element, "life-button-disabled");
	}

	// UI events handlers

	ui.play.addEventListener("click", function () {
		if (life.status == Status.Paused) {
			setButtonEnabled(ui.step, false);
			ui.play.innerHTML = "Pause";
			play();
		} else {
			setButtonEnabled(ui.step, true);
			ui.play.innerHTML = "Play";
			life.pause();
		}
	})

	ui.step.addEventListener("click", function () {
		if (isButtonEnabled(this))
			life.step();
	})

	ui.randomize.addEventListener("click", function () {
		life.randomize();
		ui.play.innerHTML = "Play";
	})

	ui.reset.addEventListener("click", function () {
		life.reset();
		ui.play.innerHTML = "Play";
	})

	ui.indicateAge.addEventListener("click", function () {
		life.graphics.indicateAge = this.checked;
		life.refresh();
	})

	ui.maxperf.addEventListener("click", function () {
		if (life.status == Status.Playing)
			restart();
	})

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
		if (life.status == Status.Playing)
			restart();
	})

	life.updateInfoCallback = function () {
		ui.generation.innerHTML = life.core.generation.toString();
		ui.population.innerHTML = life.core.population.toString();
		ui.fps.innerHTML        = life.freqMeter.freq.toFixed(1);
	}
}
