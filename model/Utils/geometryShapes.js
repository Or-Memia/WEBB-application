class Line
{
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

class Point
{
    constructor(x, y) {
        this.y = y
        this.x = x
    }
}


class Circle{
    constructor(centerPoint, radius)
    {
        this.center = centerPoint;
        this.radius = radius;
    }
}



exportModuls();

function exportModuls() {
    // module.exports.Line = Line
    module.exports.Point = Point
    module.exports.Circle = Circle
}