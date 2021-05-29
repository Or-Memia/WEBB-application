const CorrelatedFeatures = require("../CorrelatedFeatures");
const Shapes = require("../Shapes");
const AnomalyReport = require("../AnomalyReport");
const anomalyDetectionUtil = require('../AnomalyDetectionUtil')


class LinearAlgorithm {
    #cf
    #threshold
    #anomalyDetectionUtil

    constructor() {
        this.#cf = []
        this.#anomalyDetectionUtil = new anomalyDetectionUtil();
        this.#threshold = 0
        this.f = false;
    }

    learnNormal(ts) {
        let p = new Shapes.Point(0, 0), points = [ts.getNumOfInfoLines()];
        let feature1, feature2 = "x", line = new Shapes.Line();
        let sizeOfData = ts.getNumOfInfoLines(), sizeOfFeatures = ts.getNumOfFeatures();
        let maxCorrelation = 0, x = [], y = [];
        //let matrix = ts.getMatrix();
        for (let i = 0; i < sizeOfFeatures; i++) {
            maxCorrelation = 0;
            feature1 = ts.getFeature()[i];
            for (let j = i + 1; j < sizeOfFeatures; j++) {
                this.copyArray(ts, i, x);
                this.copyArray(ts, j, y);
                let correlation = this.#anomalyDetectionUtil.pearson(x, y);
                for (let k = 0; k < sizeOfData; k++) {
                    points[k] = new Shapes.Point(x[k], y[k]);
                }

                if (Math.abs(correlation) >= Math.abs(maxCorrelation)) {
                    maxCorrelation = correlation;
                    feature2 = ts.getFeature()[j];
                    line = this.createLine(points, correlation);
                    this.#threshold = this.getThreshold(ts, line, x, y, points, maxCorrelation);
                    p = this.createPoint(points, maxCorrelation);
                }
            }
            this.learnHelper(ts, maxCorrelation, feature1, feature2, points);
        }
    }

    // toPoints(v1,v2){
    //     let ps = new Array(v1.length)
    //     for (let i = 0; i < v1.length; i++){
    //         ps[i] = new Shapes.Point(parseFloat(v1[i]), parseFloat(v2[i]));
    //     }
    //     return ps;
    // }

    detect(ts) {
        let anomaly = [];
        for (let i = 0; i < this.#cf.length; i++) {
            let correlatedFeatures = this.#cf[i];
            let x = ts.get_vector_Matrix(ts.featureLocation(correlatedFeatures.feature1));
            let y = ts.get_vector_Matrix(ts.featureLocation(correlatedFeatures.feature2));
            for (let j = 0; j < x.length; j++) {
                if (this.isDetect(x[j], y[j], correlatedFeatures)) {
                    let det = correlatedFeatures.feature1 + "-" + correlatedFeatures.feature2;
                    anomaly.push(new AnomalyReport(det, (j + 1)));
                }
            }
        }
        return anomaly;
    }


    getCf() {
        return this.#cf
    }


    // setCorrelationThreshold(newThreshold){
    //     this.#threshold = newThreshold;
    // }

    learnHelper(ts, pearson, f1, f2, points) {
        if (pearson > this.#threshold) {
            let len = ts.getNumOfFeatures();
            let c = new CorrelatedFeatures();
            c.feature1 = f1;
            c.feature2 = f2;
            c.corrlation = parseFloat(pearson);
            c.lin_reg = this.#anomalyDetectionUtil.linear_reg(points);
            c.threshold = this.findThreshold(points, len, c.lin_reg) * 1.1; // 10% increase
            this.#cf.push(c);
        }
    }

    isDetect(x, y, correlatedFeatures) {
        return (Math.abs(y - correlatedFeatures.lin_reg.f(x)) > correlatedFeatures.threshold);
    }

    findThreshold(points, len, rl){
        let max = 0;
        for (let i = 0; i < len; i++){
            let d = Math.abs(parseFloat(points[i].y) - parseFloat(rl.f(parseFloat(points[i].x))))
            if(d > max){
                max = d;
            }
        }
        return max;
    }

    getThreshold(ts, line, arrX, arrY) {
        let sizeOfData = ts.getNumOfInfoLines();
        let tempDev, maxDev = 0, threshold;
        for (let k = 0; k < sizeOfData; k++) {
            let p = new Shapes.Point(arrX[k], arrY[k]);
            tempDev = this.#anomalyDetectionUtil.dev(p, line);
            if (tempDev >= maxDev) {
                maxDev = tempDev;
                threshold = maxDev * 1.1;
            }
        }
        return threshold;
    }

    // getThreshold(){
    //     return this.#threshold;
    // }

    createPoint() {
        return new Shapes.Point(0, 0);
    }

    createLine(points) {
        return this.#anomalyDetectionUtil.linear_reg(points);
    }

    copyArray(ts, i, arr) {
        let size = ts.getNumOfInfoLines();
        for (let k = 0; k < size; k++) {
            arr[k] = ts.getMatrix()[i][k];
        }
    }

    isCorrelation(correlation) {
        if (Math.abs(correlation) > this.#threshold) {
            return 1;
        }
        return 2;
    }
}

module.exports = LinearAlgorithm

