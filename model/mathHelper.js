const Line = require("./Utils/Line")

class MathHelper {
    constructor() {
    }

    average(x_arr) {
        let sum = 0;
        for (let i = 0; i < x_arr.length; i++) {
            sum += x_arr[i];
        }
        return sum / (x_arr.length);
    }

    // returns the variance of X and Y
    var(x_arr) {
        let av = this.average(x_arr);
        let sum = 0;
        for (let i = 0; i < x_arr.length; i++) {
            sum += x_arr[i] * x_arr[i];
        }
        let s = sum / x_arr.length;
        let s1 = av * av;
        return s - s1;
    }

    // returns the covariance of X and Y
    cov(x_arr, y_arr) {
        let sum = 0;
        for (let i = 0; i < x_arr.length; i++) {
            sum += x_arr[i] * y_arr[i];
        }
        sum /= x_arr.length;
        let temp = this.average(x_arr) * this.average(y_arr);
        return sum - temp;
    }

    // returns the Pearson correlation coefficient of X and Y
    pearson(x_arr, y_arr) {
        let ret = Math.sqrt(this.var(x_arr));
        let ret2 = ret * Math.sqrt(this.var(y_arr));
        let ret3 = this.cov(x_arr, y_arr);
        return ret3 / ret2;
    }

    // performs a linear regression and returns the Shapes equation
    linear_reg(points) {
        let x = [];
        let y = [];
        for (let i = 0; i < points.length; i++) {
            x[i] = points[i].x;
            y[i] = points[i].y;
        }
        let a = this.cov(x, y) / this.var(x);
        let b = this.average(y) - a * (this.average(x));

        return new Line.Line(a, b);
    }

    // returns the deviation between point p and the Shapes
    dev2(p, l) {
        let ret = p.y - l.f(p.x);
        return Math.abs(ret);
    }

    // returns the deviation between point p and the Shapes equation of the points
    dev(p, points) {
        const l = this.linear_reg(points);
        return this.dev2(p, l);
    }
}
module.exports = MathHelper