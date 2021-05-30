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

module.exports.Line = Line
