import LifeCore from "./LifeCore";
import LifeGraphics from "./LifeGraphics";
import LifePainter from "./LifePainter";
import FreqMeter from "./FreqMeter";

export enum Status {
    Playing,
    Paused
}

export class Life {

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
