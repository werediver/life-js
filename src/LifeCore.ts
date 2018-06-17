// Double buffered grid based on single-dimensional arrays.
// Rows are stored consequently.
class DoubleGrid {

    width: number;
    height: number;

    buffer1: Array<number>;
    buffer2: Array<number>;

    constructor(width: number, height: number) {
		this.width  = width;
		this.height = height;

		this.buffer1 = new Array(width * height);
		this.buffer2 = new Array(width * height);
	}

	reset() {
		let key;
		for (key in this.buffer1)
			delete this.buffer1[key];
		for (key in this.buffer2)
			delete this.buffer2[key];
	}

	swap() {
		const tmp = this.buffer1;
		this.buffer1 = this.buffer2;
		this.buffer2 = tmp;
	}

	get(x: number, y: number) {
		return this.buffer1[y * this.width + x];
	}

	set(x: number, y: number, val: number) {
		this.buffer2[y * this.width + x] = val;
	}

	setCurrent(x: number, y: number, val: number) {
		this.buffer1[y * this.width + x] = val;
	}

	// Special cases of coordinate translation

	decx(x: number) {
		return --x >= 0 ? x : this.width - 1;
	}

	incx(x: number) {
		return ++x < this.width ? x : 0;
	}

	decy(y: number) {
		return --y >= 0 ? y : this.height - 1;
	}

	incy(y: number) {
		return ++y < this.height ? y : 0;
	}
}

class LifeCore {

    dgrid: DoubleGrid;
    generation: number = 1;
    population: number = 0;

	constructor(width: number, height: number) {
		console.log("Life on grid " + width + "x" + height + ".");

		this.dgrid = new DoubleGrid(width, height);
		this.generation = 1;
		this.population = 0;

		this.populateDefault();
	}

	reset() {
		this.dgrid.reset();
		this.generation = 1;
		this.population = 0;
	}

	// Note: step() updates population count automatically.
	updatePopulationCount() {
		let count = 0, buffer = this.dgrid.buffer1;
		for (let key in buffer)
			if (this.isCellAlive(buffer[key]))
				++count;
		this.population = count;
	}

	populateDefault() {
		/*
		 * Put this figure in the center of the grid:
		 *     o o o
		 *     o   o
		 *     o   o
		 */

		let dgrid = this.dgrid;
		let xmid = Math.round(dgrid.width  / 2);
		let ymid = Math.round(dgrid.height / 2);

		// Assuming the grid is big enough

		dgrid.set(xmid - 1, ymid - 1, this.newCell());
		dgrid.set(xmid    , ymid - 1, this.newCell());
		dgrid.set(xmid + 1, ymid - 1, this.newCell());

		dgrid.set(xmid - 1, ymid,     this.newCell());
		dgrid.set(xmid + 1, ymid,     this.newCell());

		dgrid.set(xmid - 1, ymid + 1, this.newCell());
		dgrid.set(xmid + 1, ymid + 1, this.newCell());

		dgrid.swap();

		this.updatePopulationCount();
	}

	populateRandom(fillFactor: number) {
		let dgrid = this.dgrid;
		let w = dgrid.width, h = dgrid.height;
		for (let n = w * h * fillFactor; n > 0; --n) {
			let x = Math.round((w - 1) * Math.random());
			let y = Math.round((h - 1) * Math.random());
			dgrid.set(x, y, this.newCell());
		}
		dgrid.swap();
		this.updatePopulationCount();
	}

	newCell() {
		return 1;
	}

	isCellAlive(cell: number) {
		return cell > 0;
	}

	incCellAge(cell: number) {
        cell += 1;
		return cell;
	}

	countNeighbours(x: number, y: number) {
		let count = 0, dgrid = this.dgrid;
		let _x = dgrid.decx(x), x_ = dgrid.incx(x);
		let _y = dgrid.decy(y), y_ = dgrid.incy(y);

		if (this.isCellAlive(dgrid.get(_x, _y)))
			++count;
		if (this.isCellAlive(dgrid.get(_x, y)))
			++count;
		if (this.isCellAlive(dgrid.get(_x, y_)))
			++count;

		if (this.isCellAlive(dgrid.get(x, _y)))
			++count;
		if (this.isCellAlive(dgrid.get(x, y_)))
			++count;

		if (this.isCellAlive(dgrid.get(x_, _y)))
			++count;
		if (this.isCellAlive(dgrid.get(x_, y)))
			++count;
		if (this.isCellAlive(dgrid.get(x_, y_)))
			++count;

		return count;
	}

	step() {
		let dgrid = this.dgrid;
		let w = dgrid.width;
		let h = dgrid.height;
		let count = 0;	// new population count
		for (let x = 0; x < w; ++x) {
			for (let y = 0; y < h; ++y) {
				let n = this.countNeighbours(x, y);
				let cell = dgrid.get(x, y);
				if (this.isCellAlive(cell)) {
					++count;
					if (n == 2 || n == 3)
						dgrid.set(x, y, this.incCellAge(cell));
					else
						dgrid.set(x, y, 0);
				} else {
					if (n == 3)
						dgrid.set(x, y, this.newCell());
					else
						// Ensure there is be no garbage from previous steps
						dgrid.set(x, y, 0);
				}
			}
		}
		this.dgrid.swap();
		this.population = count;
		this.generation += 1;
	}
}
