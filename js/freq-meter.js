var FreqMeter = (function () {
	function FreqMeter(n_avg) {
		// Number of samples to average
		this.n_avg = n_avg;
		this.reset();
	}

	FreqMeter.prototype.reset = function () {
		// Number of samples accumulated
		this.n    = 0;
		// Sum of accumulated samples
		this.acc  = 0;
		// The last caclulated average frequency
		this.freq = 0;
		this.lastTickDate = null;
	};

	FreqMeter.prototype.tick = function () {
		var date = new Date();
		if (this.lastTickDate !== null)
			this.acc += date - this.lastTickDate;
		++this.n;
		this.lastTickDate = date;

		if (this.n >= this.n_avg) {
			this.freq = 1000 * this.n / this.acc;
			this.n   = 0;
			this.acc = 0;
		}
	};

	return FreqMeter;
})();