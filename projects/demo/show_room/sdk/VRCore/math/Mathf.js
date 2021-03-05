export class Mathf {
    static approxEquals(a, b, tolerance = EPSILON) {  // num
        return Math.abs(a - b) < tolerance;
    }

    static round(value, digit) {
        let scale = digit * 10;
        return Math.round(value * scale) / scale;
    }
}
