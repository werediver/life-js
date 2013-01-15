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

function hexColorAdd(hexColor, delta, bounds) {
	// hexColor - "#RRGGBB"
	// delta    - [Rdelta, Gdelta, Bdelta]
	// bounds   - [[Rmin, Rmax], [Gmin, Gmax], [Bmin, Bmax]].
	var components = hexColorToComponents(hexColor);
	for (var i = 0; i < 3; ++i) {
		var x = components[i] + delta[i];
		var xMin = bounds[i][0];
		var xMax = bounds[i][1];

		if (x > xMax)
			x = xMax;
		else if (x < xMin)
			x = xMin;

		components[i] = x;
	}
	return hexColorFromComponents(components);
}

function colorBounds(dark, light) {
	var components1 = hexColorToComponents(dark);
	var components2 = hexColorToComponents(light);
	return [[components1[0], components2[0]],
			[components1[1], components2[1]],
			[components1[2], components2[2]]];
}
