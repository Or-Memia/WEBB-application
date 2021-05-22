const LinearAlgorithm = require('./LinearAlgorithm')
const Shapes = require('../Shapes')
const minCircle = require('smallest-enclosing-circle')
const CorrelatedFeatures = require("../CorrelatedFeatures");

class HybridAlgorithm extends LinearAlgorithm{
    #cf
    constructor() {
        super();
        this.#cf = super.getCf();
    }

    dist(p1,p2){
        let x2 = (p1.x - p2.x) * (p1.x - p2.x);
        let y2 = (p1.y - p2.y) * (p1.y - p2.y);
        return Math.sqrt(x2+y2);
    }

    learnHelper(ts, pearson, f1, f2, points) {
        super.learnHelper(ts, pearson, f1, f2, points);
        if(pearson > 0.5 && pearson < super.getThreshold()){
            let minCircleData = minCircle(points)
            let circle = new Shapes.Circle(new Shapes.Point(minCircleData.x, minCircleData.y), minCircleData.r)
            let corrFeatures = new CorrelatedFeatures()
            corrFeatures.feature1 = f1;
            corrFeatures.feature2 = f2;
            corrFeatures.corrlation = pearson;
            corrFeatures.threshold = circle.radius*1.1; // 10% increase
            corrFeatures.cx = circle.center.x;
            corrFeatures.cy = circle.center.y;
            this.#cf.push(corrFeatures);
        }
    }

    isAnomalous(x, y, correlatedFeatures) {
        return (correlatedFeatures.corrlation >= super.getThreshold() && super.isAnomalous(x,y,correlatedFeatures)) ||
               (correlatedFeatures.corrlation > 0.5 &&
                correlatedFeatures.corrlation < super.getThreshold() &&
                this.dist(new Shapes.Point(correlatedFeatures.cx, correlatedFeatures.cy),
                    new Shapes.Point(x, y)) > correlatedFeatures.threshold);
    }
}

module.exports = HybridAlgorithm;