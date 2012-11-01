var AssertException = (function () {
	function AssertException(message) {
		this.message = message;
	}

	AssertException.prototype.toString = function () {
		return "AssertException: " + this.message;
	}
})();

function assert(expression, description) {
	if (!expression)
		throw new AssertException(message);
}