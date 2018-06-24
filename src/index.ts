import { Life, Status } from "./Life";

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

init();
