/**
 * Color utility functions.
 * No external dependencies.
 * Come From bjohnso5/hue-hacking/src/color.js repository
 * More info : https://github.com/bjohnso5/hue-hacking 
 * Copyright (c) 2013 Bryan Johnson; Licensed MIT */
var XYToRgb = function(x, y, bright) {
    z = 1.0 - x - y;
    Y = bright/255.0; // The given brightness value
    X = (Y / y) * x;
    Z = (Y / y) * z;
    //console.log(x+' '+y+' '+z);

    r =  X * 1.656492 - Y * 0.354851 - Z * 0.255038;
    g = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
    b =  X * 0.051713 - Y * 0.121364 + Z * 1.011530;


    r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
    g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
    b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
    

    rb = Math.floor(r == 1.0 ? 255 : r * 256.0);
    gb = Math.floor(g == 1.0 ? 255 : g * 256.0);
    bb = Math.floor(b == 1.0 ? 255 : b * 256.0);

    r2 = Math.max(0.0, Math.min(1.0, r));
    red = Math.floor(r2 == 1.0 ? 255 : r2 * 256.0);
    g2 = Math.max(0.0, Math.min(1.0, g));
    green = Math.floor(g2 == 1.0 ? 255 : g2 * 256.0);
    b2 = Math.max(0.0, Math.min(1.0, b));
    blue = Math.floor(b2 == 1.0 ? 255 : b2 * 256.0);
    
    return [red, green, blue];
};

var hsbToRgb = function(hue, sat, value) {
var satNormal = sat / 255,
        valueNormal = value / 255,
        hueNormal = (hue / 65535) * 360,
        c = valueNormal * satNormal,
        x = c * (1 - Math.abs(((hueNormal / 60) % 2) - 1)),
        m = valueNormal - c,
        red = 0,
        green = 0,
        blue = 0;
if ((hueNormal >= 0) && (hueNormal < 60)) {
        red = c;
        green = x;
        blue = 0;
    } else if ((hueNormal >= 60) && (hueNormal < 120)) {
        red = x;
        green = c;
        blue = 0;
    } else if ((hueNormal >= 120) && (hueNormal < 180)) {
        red = 0;
        green = c;
        blue = x;
    } else if ((hueNormal >= 180) && (hueNormal < 240)) {
        red = 0;
        green = x;
        blue = c;
    } else if ((hueNormal >= 240) && (hueNormal < 300)) {
        red = x;
        green = 0;
        blue = c;
    } else {
        red = c;
        green = 0;
        blue = x;
    }
    return [colorNormalizedToEightBit(red + m), colorNormalizedToEightBit(green + m), colorNormalizedToEightBit(blue + m)];
    
};

var colorNormalizedToEightBit = function(value) {
    return (Math.round(value * 255));
};


var XYPoint = function (x, y) {
    this.x = x;
    this.y = y;
},

Red = new XYPoint(0.675, 0.322),
Lime = new XYPoint(0.4091, 0.518),
Blue = new XYPoint(0.167, 0.04),

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