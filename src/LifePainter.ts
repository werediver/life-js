import LifeGraphics from "LifeGraphics";

export default class LifePainter {

    canvas: HTMLCanvasElement;
    graphics: LifeGraphics;
    core: LifeCore;

    active: boolean;
    lastCol: number;
    lastRow: number;

	constructor(canvas: HTMLCanvasElement, graphics: LifeGraphics, core: LifeCore) {
		this.canvas = canvas;
		this.graphics = graphics;
		this.core = core;

        this.active = false;
		this.lastCol = -1;
		this.lastRow = -1;

		let _this = this;
		canvas.onmousedown = function (e) { _this.mousedown(e); };
		canvas.onmouseup   = function (e) { _this.mouseup(e); };
		canvas.onmousemove = function (e) { _this.mousemove(e); };
	}

	mousedown(e: MouseEvent) {
		this.active = true;
		this.mousemove(e);
	}

	mouseup(e: MouseEvent) {
		this.active = false;
		this.lastCol = -1;
		this.lastRow = -1;
	}

	mousemove(e: MouseEvent) {
		if (this.active) {
			let x = e.pageX - this.canvas.offsetLeft;
			let y = e.pageY - this.canvas.offsetTop;
			this.flipCell(x, y);
		}
	}

	flipCell(x: number, y: number) {
		let col = Math.floor(x / this.graphics.cellSize);
		let row = Math.floor(y / this.graphics.cellSize);

		if (this.lastCol != col || this.lastRow != row) {
			let cell = this.core.dgrid.get(col, row);
			this.core.dgrid.setCurrent(col, row, cell ? 0 : 1);
			this.graphics.draw(this.core);

			this.lastCol = col;
			this.lastRow = row;
		}
	}
}
