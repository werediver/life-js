function componentToHex(x) {
    var hex = x.toString(16);
    return hex.length == 2 ? hex : '0' + hex;
}

function hexColorFromComponents(components) {
	var r = components[0];
	var g = components[1];
	var b = components[2];
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexColorToComponents(hexColor) {
	var re = /#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i;
	var tokens = re.exec(hexColor);

	var r = parseInt(tokens[1], 16);
	var g = parseInt(tokens[2], 16);
	var b = parseInt(tokens[3], 16);

	return [r, g, b];
}

function interpolateColor(hexColor1, hexColor2, k) {
	// k - position to interpolate, from 0.0 to 1.0.
	var components1 = hexColorToComponents(hexColor1);
	var components2 = hexColorToComponents(hexColor2);
	var components  = new Array(3);
	for (var i = 0; i < 3; ++i) {
		var x1 = components1[i];
		var x2 = components2[i];
		components[i] = Math.round(x1 + (x2 - x1) * k);
	}
	return hexColorFromComponents(components);
}
