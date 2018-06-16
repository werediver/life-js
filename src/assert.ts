class AssertException {

    message: string

    constructor(message: string) {
        this.message = message;
    }
}

function assert(expression: boolean, message: string) {
	if (!expression)
		throw new AssertException(message);
}
