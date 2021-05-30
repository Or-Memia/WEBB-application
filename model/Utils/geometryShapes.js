class Line {
    constructor(a, b) {
        if (a === undefined) {
            this.a = 0
            this.b = 0
        } else {
            this.a = a
            this.b = b
        }
    }

    f(x) {
        return this.a * x + this.b;
    }
}

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}


class Circle{
    constructor(point, r) {
        this.center = point;
        this.radius = r;
    }
}

module.exports.Line = Line
module.exports.Point = Point
module.exports.Circle = Circle