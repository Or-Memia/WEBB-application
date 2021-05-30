const correlatingFeatures = require("./Utils/correlatingFeatures");
const AnomalyReport = require("./getResults");
const mathHelper = require('./Utils/mathHelper')
const Point = require('./Utils/Point')

function pushAnomaly(x, y, correlatedFeatures, anomaly) {
    let j;
    for (j = 0; j < x.length; j++) {
        if (this.isAnomalous(x[j], y[j], correlatedFeatures)) {
            let det = correlatedFeatures.F1 + "-" + correlatedFeatures.F2;
            anomaly.push(new AnomalyReport(det, (j + 1)));
        }
    }
}

function enterValuesToMatrix(attribute, timeSeries, rowsNumber, vals) {
    let k;
    for (k = 0; k < attribute.length; k++) {
        let x = timeSeries.getRowValuesOfFeature(attribute[k])
        for (let j = 0; j < rowsNumber; j++) {
            vals[k][j] = parseFloat(x[j]);
        }
    }
}

class Linear {
    #correlationFeatures
    #threshold
    #mathHelper

    constructor()
    {
        this.#correlationFeatures = []
        this.#mathHelper = new mathHelper();
        this.#threshold = 0.9
    }

    findMostCorrelative(attribute, vals, timeSeries)
    {
        let t;
        for (t = 0; t < attribute.length; t++)
        {
            let feature1 = attribute[t];
            let tempMax = 0;
            let jMax = 0;
            for (let j = t + 1; j < attribute.length; j++)
            {
                let pearson = Math.abs(parseFloat(this.#mathHelper.pearson(vals[t], vals[j])))
                if (pearson > tempMax)
                {
                    tempMax = pearson;
                    jMax = j;
                }
            }

            let feature2 = attribute[jMax];
            let ps = this.toPoints(timeSeries.getRowValuesOfFeature(feature1), timeSeries.getRowValuesOfFeature(feature2));
            this.learnHelper(timeSeries, tempMax, feature1, feature2, ps);
        }
    }

    learnNormal(timeSeries)
    {
        let attribute = timeSeries.getFeature()
        let vals = new Array(attribute.length)
        let rowsNumber = timeSeries.getNumOfInfoLines()
        let j;
        for (j = 0; j < attribute.length; j++)
        {
            vals[j] = new Array(rowsNumber);
        }
        enterValuesToMatrix(attribute, timeSeries, rowsNumber, vals);
        this.findMostCorrelative(attribute, vals, timeSeries);
    }

    toPoints(value1, value2)
    {
        let points = new Array(value1.length)
        for (let l = 0; l < value1.length; l++)
        {
            points[l] = new Point.Point(parseFloat(value1[l]), parseFloat(value2[l]));
        }
        return points;
    }

    detect(timeSeries)
    {
        let anomaly = [];
        let d;
        for (d = 0; d < this.#correlationFeatures.length; d++)
        {
            let correlatedFeatures = this.#correlationFeatures[d];
            let x = timeSeries.getRowValuesOfFeature(correlatedFeatures.F1);
            let y = timeSeries.getRowValuesOfFeature(correlatedFeatures.F2);
            pushAnomaly.call(this, x, y, correlatedFeatures, anomaly);
        }
        return anomaly;
    }

    getCorrelationFeatures()
    {
        return this.#correlationFeatures
    }

    learnHelper(timeSeries, pearson, feature1, feature2, points)
    {
        if (pearson > this.#threshold)
        {
            let linesNumber = timeSeries.getNumOfInfoLines();
            let correlatingFeatures1 = new correlatingFeatures();
            correlatingFeatures1.F1 = feature1;
            correlatingFeatures1.F2 = feature2;
            correlatingFeatures1.maxCorrelation = parseFloat(pearson);
            correlatingFeatures1.linearRegression = this.#mathHelper.linearRegression(points);
            correlatingFeatures1.threshold = this.findThreshold(points, linesNumber, correlatingFeatures1.linearRegression) * 1.1;
            this.#correlationFeatures.push(correlatingFeatures1);
        }
    }
//flout x , flout y .correlated features c
    isAnomalous(x, y, c)
    {
        return (Math.abs(y - c.linearRegression.getValWithM(x)) > c.threshold);
    }

    findThreshold(points, size, line)
    {
        let tempMax = 0;
        let m;
        for (m = 0; m < size; m++)
        {
            let dev = Math.abs(parseFloat(points[m].y) - parseFloat(line.getValWithM(parseFloat(points[m].x))))
            if (dev > tempMax)
            {
                tempMax = dev;
            }
        }
        return tempMax;
    }

    getThreshold()
    {
        return this.#threshold;
    }
}

module.exports = Linear