function exportModules() {
    const linear = require('./linear')
    const Circle = require('./Utils/Circle')
    const Point = require('./Utils/Point')
    const minCircle = require('smallest-enclosing-circle')
    const CorrelatingFeatures = require("./Utils/correlatingFeatures");
    return {linear, Circle, Point, minCircle, CorrelatingFeatures};
}

const {linear, Circle, Point, minCircle, CorrelatingFeatures} = exportModules();

class Hybrid extends linear {
    #correlationFeatures

    constructor() {
        super();
        this.#correlationFeatures = super.getCorrelationFeatures();
    }

    learnHelper(timeSeries, pearson, feature1, feature2, points)
    {
        super.learnHelper(timeSeries, pearson, feature1, feature2, points);
        if (pearson > 0.5 && pearson < super.getThreshold())
        {
            let minCircle1 = minCircle(points)
            let circle1 = new Circle.Circle(new Point.Point(minCircle1.x, minCircle1.y), minCircle1.r)
            let correlatingFeatures = new CorrelatingFeatures()
            correlatingFeatures.y = circle1.center.y;
            correlatingFeatures.x = circle1.center.x;
            correlatingFeatures.threshold = circle1.radius * 1.1;
            correlatingFeatures.maxCorrelation = pearson;
            correlatingFeatures.F2 = feature2;
            correlatingFeatures.F1 = feature1;
            this.#correlationFeatures.push(correlatingFeatures);
        }
    }
//flout x , flout y .correlated features c
    isAnomalous(x, y, c) {
        if (Math.abs(c.maxCorrelation) > 0.9)
        {
            return super.isAnomalous(x, y, c);
        }
        else
        {
            let powX = Math.pow(x - c.x, 2);
            let powY = Math.pow(y - c.y, 2);
            let sqrt = Math.sqrt(powX + powY);
            return (sqrt > c.threshold);
        }
    }

}

module.exports = Hybrid;