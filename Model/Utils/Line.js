class Line
{
    constructor(a, b) {
        if (a !== undefined) {
            this.a = a
            this.b = b
        }
        else
        {
            setDefaultPoint.call(this);
        }
    }

    getValWithM(m) {
        return this.a * m + this.b;
    }
}

function setDefaultPoint() {
    this.a = 0
    this.b = 0
}
module.exports.Line = Line
