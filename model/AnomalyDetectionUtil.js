const Shapes = require("./Shapes")
let mathjs = require('mathjs')

class AnomalyDetectionUtil {
    constructor() {
    }

    avg(arr) {
        let sum = 0;
        for(let i = 0; i < arr.length; i++){
            sum += parseFloat(arr[i]);
        }
        return sum / arr.length;
    }

    // returns the variance of X and Y
    var(arr) {
        let av = this.avg(arr);
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += parseFloat(arr[i]) * parseFloat(arr[i]);
        }
        return sum / arr.length - av * av;
    }

    // returns the covariance of X and Y
    cov(arr1, arr2) {
        let sum = 0;
        let size = arr1.length;
        let ex = this.avg(arr1, size);
        let ey = this.avg(arr2, size);
        for(let i = 0; i < size; i++)
            sum = sum + (parseFloat(arr1[i]) - ex) *
                (parseFloat(arr2[i]) - ey);
        return sum / size;
    }

    // returns the Pearson correlation coefficient of X and Y
    pearson(arr1, arr2) {
        let pearson = parseFloat(this.cov(arr1, arr2)) /
            (Math.sqrt(parseFloat(this.var(arr1))) * Math.sqrt(parseFloat(this.var(arr2))));
        if(isNaN(pearson)) {
            return 0;
        }else if(pearson === Infinity){
            return 1;
        }else{
            return pearson;
        }
    }

    // performs a linear regression and returns the Shapes equation
    linear_reg(points) {
        let size = points.length;
        let x = new Array(size);
        let y = new Array(size);
        for (let i = 0; i < size; i++) {
            x[i] = parseFloat(points[i].x);
            y[i] = parseFloat(points[i].y);
        }
        const a = this.cov(x, y) / this.var(x);
        const b = this.avg(y)  - a * this.avg(x);
        return new Shapes.Line(a, b);
    }

    // returns the deviation between point p and the Shapes
    dev2(p, l) {
        return Math.abs(parseFloat(p.y) - parseFloat(l.f(parseFloat(p.x))));
    }

    // returns the deviation between point p and the Shapes equation of the points
    dev(p, points, size) {
        let l = this.linear_reg(points, size);
        return this.dev2(p, l);
    }
}
module.exports = AnomalyDetectionUtil