export default class FreqMeter {

    /** Number of samples to average */
    n_avg: number;
    /** Number of samples accumulated */
    n: number = 0;
    /** Sum of accumulated samples */
    acc: number = 0;
    /** The last caclulated average frequency */
    freq: number = 0;
    lastTickDate: Date | null = null;

    constructor(n_avg: number) {
       this.n_avg = n_avg;
    }

    reset() {
        this.n = 0;
        this.acc = 0;
        this.freq = 0;
        this.lastTickDate = null;
    }

    tick() {
		let date = new Date();
		if (this.lastTickDate !== null)
			this.acc += date.getTime() - this.lastTickDate.getTime();
		this.n += 1;
		this.lastTickDate = date;

		if (this.n >= this.n_avg) {
			this.freq = 1000 * this.n / this.acc;
			this.n   = 0;
			this.acc = 0;
		}
	}
}
