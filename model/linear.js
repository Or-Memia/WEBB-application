const CorrelatedFeatures = require("./Utils/correlatingFeatures");
const AnomalyReport = require("./getResults");
const mathHelper = require('./mathHelper')
const Point = require('./Utils/Point')

class Linear {
    #cf
    #threshold
    #anomalyDetectionUtil


    constructor()
    {
        this.#cf = []
        this.#anomalyDetectionUtil = new mathHelper();
        this.#threshold = 0.9
        this.f = false;
    }

    learnNormal(timeSeries)
    {
        let attribute = timeSeries.getFeature()

        //init vals
        let vals = new Array(attribute.length)
        let rowsNumber = timeSeries.getNumOfInfoLines()
        let j;
        for (j = 0; j < attribute.length; j++)
        {
            vals[j] = new Array(rowsNumber);
        }

        //fill vals
        let k;
        for (k = 0; k < attribute.length; k++)
        {
            let x = timeSeries.getRowValuesOfFeature(attribute[k])
            for (let j = 0; j < rowsNumber; j++)
            {
                vals[k][j] = parseFloat(x[j]);
            }
        }

        let t;
        for (t = 0; t < attribute.length; t++)
        {
            let feature1 = attribute[t];
            let tempMax = 0;
            let jMax = 0;

            //find the most correlative
            for (let j = t + 1; j < attribute.length; j++)
            {
                let pearson = Math.abs(parseFloat(this.#anomalyDetectionUtil.pearson(vals[t], vals[j])))
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

    toPoints(v1, v2)
    {
        let ps = new Array(v1.length)
        for (let i = 0; i < v1.length; i++)
        {
            ps[i] = new Point.Point(parseFloat(v1[i]), parseFloat(v2[i]));
        }
        return ps;
    }

    detect(timeSeries)
    {
        let anomaly = [];
        for (let i = 0; i < this.#cf.length; i++)
        {
            let correlatedFeatures = this.#cf[i];
            let x = timeSeries.getRowValuesOfFeature(correlatedFeatures.F1);
            let y = timeSeries.getRowValuesOfFeature(correlatedFeatures.F2);
            for (let j = 0; j < x.length; j++)
            {
                if (this.isAnomalous(x[j], y[j], correlatedFeatures))
                {
                    let det = correlatedFeatures.F1 + "-" + correlatedFeatures.F2;
                    anomaly.push(new AnomalyReport(det,(j+1)));
                }
            }
        }
        return anomaly;
    }

    getCf()
    {
        return this.#cf
    }

    setCorrelationThreshold(newThreshold)
    {
        this.#threshold = newThreshold;
    }

    learnHelper(timeSeries, pearson, feature1, feature2, points)
    {
        if (pearson > this.#threshold)
        {
            let len = timeSeries.getNumOfInfoLines();
            let c = new CorrelatedFeatures();
            c.F1 = feature1;
            c.F2 = feature2;
            c.maxCorrlation = parseFloat(pearson);
            c.linearRegression = this.#anomalyDetectionUtil.linearRegression(points);
            c.threshold = this.findThreshold(points, len, c.linearRegression) * 1.1; // 10% increase
            this.#cf.push(c);
        }
    }
//flout x , flout y .correlated features c
    isAnomalous(x, y, c)
    {
        return (Math.abs(y - c.linearRegression.getValWithM(x)) > c.threshold);
    }

    findThreshold(points, len, rl)
    {
        let max = 0;
        let i;
        for (i = 0; i < len; i++)
        {
            let d = Math.abs(parseFloat(points[i].y) - parseFloat(rl.getValWithM(parseFloat(points[i].x))))
            if (d > max)
            {
                max = d;
            }
        }
        return max;
    }

    getThreshold()
    {
        return this.#threshold;
    }
}

module.exports = Linear