const Line = require("./Line")

class MathHelper
{
    constructor()
    {

    }
//return the average of arrayX
    average(arrayX)
    {
        let sum = 0;
        let j;
        for (j = 0; j < arrayX.length; j++)
        {
            sum += arrayX[j];
        }
        return sum / (arrayX.length);
    }

    // returns the variance of X and Y
    variance(arrayX)
    {
        let avg = this.average(arrayX);
        let sum = 0;
        let k;
        for (k = 0; k < arrayX.length; k++)
        {
            sum += arrayX[k] * arrayX[k];
        }
        let div = sum / arrayX.length;
        let pow_2 = avg * avg;
        return div - pow_2;
    }

// returns the covariance of arrayX and arrayY
    covariance(arrayX, arrayY)
    {
        let sum = 0;
        let h;
        for (h = 0; h < arrayX.length; h++)
        {
            sum += arrayX[h] * arrayY[h];
        }
        sum /= arrayX.length;
        let avgX = this.average(arrayX);
        let avgY = this.average(arrayY);
        let mul = avgX * avgY;
        return sum - mul;
    }

// returns the Pearson correlation coefficient of arrayX and arrayY
    pearson(arrayX, arrayY)
    {
        let varX = Math.sqrt(this.variance(arrayX));
        let varY = Math.sqrt(this.variance(arrayY));
        let cov = this.covariance(arrayX, arrayY);
        return cov / (varX * varY);
    }

    // performs a linear regression and returns the line equation
    linearRegression(points)
    {
        let array_x = [];
        let array_y = [];
        let t;
        for (t = 0; t < points.length; t++)
        {
            array_x[t] = points[t].x;
            array_y[t] = points[t].y;
        }
        let a = this.covariance(array_x, array_y) / this.variance(array_x);
        let b = this.average(array_y) - a * (this.average(array_x));

        return new Line.Line(a, b);
    }

    // returns the deviation between point and the line
    deviation(point, line)
    {
        let ret = point.y - line.getValWithM(point.x);
        return Math.abs(ret);
    }

// returns the deviation between point  and the line equation of the points
    secondDeviation(point, points)
    {
        const line = this.linearRegression(points);
        return this.deviation(point, line);
    }
}
module.exports = MathHelper