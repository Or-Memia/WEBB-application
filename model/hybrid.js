const LinearAlgorithm = require('./linear')
const Shapes = require('./Utils/geometryShapes')
const minCircle = require('smallest-enclosing-circle')
const CorrelatedFeatures = require("./Utils/CorrelatedFeatures");

class Hybrid extends LinearAlgorithm {
    #cf

    constructor() {
        super();
        this.#cf = super.getCf();
    }


    learnHelper(ts, pearson, f1, f2, points) {
        super.learnHelper(ts, pearson, f1, f2, points);
        if (pearson > 0.5 && pearson < super.getThreshold()) {
            let minCircleData = minCircle(points)
            let circle = new Shapes.Circle(new Shapes.Point(minCircleData.x, minCircleData.y), minCircleData.r)
            let corrFeatures = new CorrelatedFeatures()
            corrFeatures.feature1 = f1;
            corrFeatures.feature2 = f2;
            corrFeatures.corrlation = pearson;
            corrFeatures.threshold = circle.radius * 1.1; // 10% increase
            corrFeatures.cx = circle.center.x;
            corrFeatures.cy = circle.center.y;
            this.#cf.push(corrFeatures);
        }
    }

    isDetect(x, y, correlatedFeatures) {
        if (Math.abs(correlatedFeatures.corrlation) > 0.9) {
            return super.isDetect(x, y, correlatedFeatures);
        } else {
            let distance = Math.sqrt((Math.pow(x - correlatedFeatures.x, 2) +
                Math.pow(y - correlatedFeatures.y, 2)));
            return (distance > correlatedFeatures.threshold);
        }
    }

}

module.exports = Hybrid;