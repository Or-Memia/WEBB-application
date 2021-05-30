const CorrelatedFeatures = require("./CorrelatedFeatures");
const Shapes = require("./Shapes");
const AnomalyReport = require("./AnomalyReport");
const anomalyDetectionUtil = require('./AnomalyDetectionUtil')

class LinearAlgorithm {
    #cf
    #threshold
    #anomalyDetectionUtil

    constructor() {
        this.#cf = []
        this.#anomalyDetectionUtil = new anomalyDetectionUtil();
        this.#threshold = 0.9
        this.f = false;
    }

    learnNormal(ts) {
        let atts = ts.getFeature()

        //init vals
        let vals = new Array(atts.length)
        let numOfRows = ts.getNumOfInfoLines()
        for (let i = 0; i < atts.length; i++) {
            vals[i] = new Array(numOfRows);
        }

        //fill vals
        for (let i = 0; i < atts.length; i++) {
            let x = ts.getRowValuesOfFeature(atts[i])
            for (let j = 0; j < numOfRows; j++) {
                vals[i][j] = parseFloat(x[j]);
            }
        }

        for (let i = 0; i < atts.length; i++) {
            let f1 = atts[i];
            let max = 0;
            let jMax = 0;

            //find the most correlative
            for (let j = i + 1; j < atts.length; j++) {
                let p = Math.abs(parseFloat(this.#anomalyDetectionUtil.pearson(vals[i], vals[j])))
                if (p > max) {
                    max = p;
                    jMax = j;
                }
            }

            let f2 = atts[jMax];
            let ps = this.toPoints(ts.getRowValuesOfFeature(f1), ts.getRowValuesOfFeature(f2));
            this.learnHelper(ts, max, f1, f2, ps);
        }
    }

    toPoints(v1, v2) {
        let ps = new Array(v1.length)
        for (let i = 0; i < v1.length; i++) {
            ps[i] = new Shapes.Point(parseFloat(v1[i]), parseFloat(v2[i]));
        }
        return ps;
    }

    detect(ts) {
        let anomaly = [];
        for (let i = 0; i < this.#cf.length; i++) {
            let correlatedFeatures = this.#cf[i];
            let x = ts.getRowValuesOfFeature(correlatedFeatures.feature1);
            let y = ts.getRowValuesOfFeature(correlatedFeatures.feature2);
            for (let j = 0; j < x.length; j++) {
                if (this.isDetect(x[j], y[j], correlatedFeatures)) {
                    let det = correlatedFeatures.feature1 + "-" + correlatedFeatures.feature2;
                    anomaly.push(new AnomalyReport(det,(j+1)));
                }
            }
        }
        return anomaly;
    }

    getCf() {
        return this.#cf
    }

    setCorrelationThreshold(newThreshold) {
        this.#threshold = newThreshold;
    }

    learnHelper(ts, pearson, f1, f2, points) {
        if (pearson > this.#threshold) {
            let len = ts.getNumOfInfoLines();
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

    findThreshold(points, len, rl) {
        let max = 0;
        for (let i = 0; i < len; i++) {
            let d = Math.abs(parseFloat(points[i].y) - parseFloat(rl.f(parseFloat(points[i].x))))
            if (d > max) {
                max = d;
            }
        }
        return max;
    }

    getThreshold() {
        return this.#threshold;
    }
}

module.exports = LinearAlgorithm