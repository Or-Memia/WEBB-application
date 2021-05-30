const LinearAlgorithm = require('./linear')
const Circle = require('./Utils/Circle')
const Point = require('./Utils/Point')
const minCircle = require('smallest-enclosing-circle')
const CorrelatedFeatures = require("./Utils/correlatingFeatures");

class Hybrid extends LinearAlgorithm {
    #cf

    constructor() {
        super();
        this.#cf = super.getCf();
    }


    learnHelper(ts, pearson, f1, f2, points)
    {
        super.learnHelper(ts, pearson, f1, f2, points);
        if (pearson > 0.5 && pearson < super.getThreshold()) {
            let minCircleData = minCircle(points)
            let circle = new Circle.Circle(new Point.Point(minCircleData.x, minCircleData.y), minCircleData.r)
            let corrFeatures = new CorrelatedFeatures()
            corrFeatures.feature1 = f1;
            corrFeatures.feature2 = f2;
            corrFeatures.maxCorrlation = pearson;
            corrFeatures.threshold = circle.radius * 1.1; // 10% increase
            corrFeatures.x = circle.center.x;
            corrFeatures.y = circle.center.y;
            this.#cf.push(corrFeatures);
        }
    }
//flout x , flout y .correlated features c
    isAnomalous(x, y, c) {
        if (Math.abs(c.maxCorrlation) > 0.9) {
            return super.isAnomalous(x, y, c);
        } else {
            let dis = Math.sqrt((Math.pow(x - c.x, 2) +
                Math.pow(y - c.y, 2)));
            return (dis > c.threshold);
        }
    }

}

module.exports = Hybrid;