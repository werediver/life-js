export default function interpolateColor(hexColor1: string, hexColor2: string, k: number): string {
	// k - position to interpolate, from 0.0 to 1.0.
	let components1 = hexColorToComponents(hexColor1);
	let components2 = hexColorToComponents(hexColor2);

    if (components1 !== null && components2 !== null) {
    	let components = new Array<number>(3);
    	for (let i = 0; i < 3; ++i) {
    		let x1 = components1[i];
    		let x2 = components2[i];
    		components[i] = Math.round(x1 + (x2 - x1) * k);
    	}

        return hexColorFromComponents(components);
    }

    return hexColor1; // Fallback
}

function hexColorToComponents(hexColor: string): [number, number, number] | null {
	let re = /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i;
	let tokens = re.exec(hexColor);

    if (tokens !== null) {
    	let r = parseInt(tokens[1], 16);
    	let g = parseInt(tokens[2], 16);
    	let b = parseInt(tokens[3], 16);

        return [r, g, b];
    }

    return null
}

function hexColorFromComponents(components: Array<number>) {
	let r = components[0];
	let g = components[1];
	let b = components[2];
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(x: number) {
    let hex = x.toString(16);
    return hex.length == 2 ? hex : '0' + hex;
}
