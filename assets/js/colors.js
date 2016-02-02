/**
 * Color utility functions.
 * No external dependencies.
 * Come From bjohnso5/hue-hacking/src/color.js repository
 * More info : https://github.com/bjohnso5/hue-hacking 
 * Copyright (c) 2013 Bryan Johnson; Licensed MIT */

var XYPoint = function (x, y) {
    this.x = x;
    this.y = y;
},

Red = new XYPoint(0.675, 0.322),
Lime = new XYPoint(0.4091, 0.518),
Blue = new XYPoint(0.167, 0.04),

hexToRed = function (hex) {
    return parseInt( hex.substring(0, 2), 16 );
}
    
hexToGreen = function (hex) {
    return parseInt( hex.substring(2, 4), 16 );
}

hexToBlue = function (hex) {
    return parseInt( hex.substring(4, 6), 16 );
}

hexToRGB = function (h) {
    var rgb = [hexToRed(h), hexToGreen(h), hexToBlue(h)];
    return rgb;
}

componentToHex = function (c) {
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

rgbToHex = function (r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

crossProduct = function (p1, p2) {
    return (p1.x * p2.y - p1.y * p2.x);
}

checkPointInLampsReach = function (p) {
    var v1 = new XYPoint(Lime.x - Red.x, Lime.y - Red.y),
        v2 = new XYPoint(Blue.x - Red.x, Blue.y - Red.y),

        q = new XYPoint(p.x - Red.x, p.y - Red.y),

        s = crossProduct(q, v2) / crossProduct(v1, v2),
        t = crossProduct(v1, q) / crossProduct(v1, v2);

    return (s >= 0.0) && (t >= 0.0) && (s + t <= 1.0);
}

getClosestPointToLine = function (A, B, P) {
    var AP = new XYPoint(P.x - A.x, P.y - A.y),
        AB = new XYPoint(B.x - A.x, B.y - A.y),
        ab2 = AB.x * AB.x + AB.y * AB.y,
        ap_ab = AP.x * AB.x + AP.y * AB.y,
        t = ap_ab / ab2;

    if (t < 0.0) {
        t = 0.0;
    } else if (t > 1.0) {
        t = 1.0;
    }

    return new XYPoint(A.x + AB.x * t, A.y + AB.y * t);
}

getDistanceBetweenTwoPoints = function (one, two) {
    var dx = one.x - two.x, // horizontal difference
        dy = one.y - two.y; // vertical difference

    return Math.sqrt(dx * dx + dy * dy);
}

getClosestPointToPoint = function (xyPoint) {
    // Color is unreproducible, find the closest point on each line in the CIE 1931 'triangle'.
    var pAB = getClosestPointToLine(Red, Lime, xyPoint),
        pAC = getClosestPointToLine(Blue, Red, xyPoint),
        pBC = getClosestPointToLine(Lime, Blue, xyPoint),

        // Get the distances per point and see which point is closer to our Point.
        dAB = getDistanceBetweenTwoPoints(xyPoint, pAB),
        dAC = getDistanceBetweenTwoPoints(xyPoint, pAC),
        dBC = getDistanceBetweenTwoPoints(xyPoint, pBC),

        lowest = dAB,
        closestPoint = pAB;

    if (dAC < lowest) {
        lowest = dAC;
        closestPoint = pAC;
    }

    if (dBC < lowest) {
        lowest = dBC;
        closestPoint = pBC;
    }

    return closestPoint;
}


getXYPointFromRGB = function (red, green, blue) {

    var r = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92),
        g = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92),
        b = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92),

        X = r * 0.4360747 + g * 0.3850649 + b * 0.0930804,
        Y = r * 0.2225045 + g * 0.7168786 + b * 0.0406169,
        Z = r * 0.0139322 + g * 0.0971045 + b * 0.7141733,

        cx = X / (X + Y + Z),
        cy = Y / (X + Y + Z);

    cx = isNaN(cx) ? 0.0 : cx;
    cy = isNaN(cy) ? 0.0 : cy;

    //Check if the given XY value is within the colourreach of our lamps.
    var xyPoint = new XYPoint(cx, cy),
        inReachOfLamps = checkPointInLampsReach(xyPoint);

    if (!inReachOfLamps) {
        var closestPoint = getClosestPointToPoint(xyPoint);
        cx = closestPoint.x;
        cy = closestPoint.y;
    }

    return new XYPoint(cx, cy);
}
    
getRGBFromXYAndBrightness = function (x, y, bri) {
    var xyPoint = new XYPoint(x, y);

    if (bri === undefined) {
        bri = 1;
    }

    // Check if the xy value is within the color gamut of the lamp.
    // If not continue with step 2, otherwise step 3.
    // We do this to calculate the most accurate color the given light can actually do.
    if (! checkPointInLampsReach(xyPoint)) {
        // Calculate the closest point on the color gamut triangle
        // and use that as xy value See step 6 of color to xy.
        xyPoint = getClosestPointToPoint(xyPoint);
    }

    // Calculate XYZ values Convert using the following formulas:
    var Y = bri,
        X = (Y / xyPoint.y) * xyPoint.x,
        Z = (Y / xyPoint.y) * (1 - xyPoint.x - xyPoint.y);

    // Convert to RGB using Wide RGB D65 conversion.
    var rgb =  [
         X * 1.612 - Y * 0.203 - Z * 0.302,
        -X * 0.509 + Y * 1.412 + Z * 0.066,
         X * 0.026 - Y * 0.072 + Z * 0.962
    ];

    // Apply reverse gamma correction.
    rgb = rgb.map(function (x) {
        return (x <= 0.0031308) ? (12.92 * x) : ((1.0 + 0.055) * Math.pow(x, (1.0 / 2.4)) - 0.055);
    });

    // Bring all negative components to zero.
    rgb = rgb.map(function (x) { return Math.max(0, x); });

    // If one component is greater than 1, weight components by that value.
    var max = Math.max(rgb[0], rgb[1], rgb[2]);
    if (max > 1) {
        rgb = rgb.map(function (x) { return x / max; });
    }

    rgb = rgb.map(function (x) { return Math.floor(x * 255); });

    return rgb;
};