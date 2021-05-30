function extractModules()
{
    const fs = require('fs')
    const TimeSeries = require('./Utils/TimeSeries')
    const linear = require('./linear')
    const hybrid = require('./hybrid')
    return {fs, TimeSeries, linear, hybrid};
}

const {fs, TimeSeries, linear, hybrid} = extractModules();

function createMatrix(row, col)
{
    let arr = new Array(row), i;
    for (i = 0; i < row; i++)
    {
        arr[i] = new Array(col);
    }
    return arr;
}

function fillCsvKeys(info)
{
    //init and fill csv keys
    let keys = info[0].split(",")
    keys[keys.length - 1] = keys[keys.length - 1].replaceAll("\r", "\n").slice(0, -1)
    return keys;
}

function splitMethod(valuesNumber, valuesInfo, info)
{
    for (let i = 0; i < valuesNumber; i++)
    {
        valuesInfo[i] = info[i + 1].split(",");
    }
}

function fromMatrixTOString(length, valuesNumber, vals, valuesInfo)
{
    for (let i = 0; i < length; i++)
    {
        for (let j = 0; j < valuesNumber; j++)
        {
            vals[i][j] = valuesInfo[j][i].toString();
        }
    }
}

function deleteBackSlashRow(valuesNumber, vals)
{
    for (let i = 0; i < valuesNumber; i++)
    {
        vals[vals.length - 1][i] = vals[vals.length - 1][i].replaceAll("\r", "\n").slice(0, -1)
    }
}

function fillCsvValues(valuesNumber, length, info)
{
    //init and fill data values
    let details = createMatrix(valuesNumber, length)
    splitMethod(valuesNumber, details, info);

    //init and fill csv values
    let values = createMatrix(length, valuesNumber)
    fromMatrixTOString(length, valuesNumber, values, details);
    //remove "\r" from last row of values
    deleteBackSlashRow(valuesNumber, values);

    return values;
}



const createCsvFile = (info, name) =>
{
    let p = "AnomaliesOutputFiles/" + name + ".csv";
    fs.writeFileSync(p, info, (err) =>
    {
        if (err) {
            console.error(err)
        }
    });
    return p;
}

function setMapValues(Keys, valueAndKey, vals)
{
    for (let i = 0; i < Keys.length; i++)
    {
        valueAndKey.set(Keys[i], vals[i]);
    }
}

function setTimeStep(arr, m, anomaly)

{
    arr[m][2] = anomaly[m].rowID
}

function initValues(trainSet, testSetInput)
{
    let info = trainSet.toString().split("\n");
    let Keys = fillCsvKeys(info);
    let vals = fillCsvValues(info.length - 2, Keys.length, info);
    let trainP = createCsvFile(info = trainSet.toString(), "train")
    let testP = createCsvFile(testSetInput.toString(), "anomaly")
    let trainTimeSeries = new TimeSeries(trainP);
    return {Keys: Keys, vals: vals, testP: testP, trainTimeSeries: trainTimeSeries};
}

function splitCorrelated(anomalies, arr, corrFeatures)
{
    let m;
    for (m = 0; m < anomalies.length; m++) {
        let cureFeature = anomalies[m].information;

        // split the two correlative by '+'
        let feat = cureFeature.split("+");
        arr[m] = new Array(3)

        // fill the arrays with the correct values of the anomalies and the line it happened
        let k;
        for (k = 0; k < corrFeatures.length; k++)
        {
            if (corrFeatures[k].feature1 !== feat[0])
            {
                if (corrFeatures[k].feature1 === feat[1])
                {
                    arr[m][0] = feat[1]
                    arr[m][1] = feat[0]
                    setTimeStep(arr, m, anomalies);
                }
            }
            else
            {
                arr[m][0] = feat[0]
                arr[m][1] = feat[1]
                setTimeStep(arr, m, anomalies);
            }
        }
    }
}

function setCorrelated(Keys, topCorrelacted, corrFeatures)
{
    for (let i = 0; i < Keys.length; i++)
    {
        let currentFeature = Keys[i];
        if (currentFeature === Keys[0])
        {
            topCorrelacted.set(currentFeature, Keys[1]);
        } else {
            topCorrelacted.set(currentFeature, Keys[0]);
        }

        for (let j = 0; j < corrFeatures.length; j++)
        {
            if (corrFeatures[j].feature1 === currentFeature)
            {
                topCorrelacted.set(currentFeature, corrFeatures[j].feature2);
            }
        }
    }
}

function whichAlgo(algoType, trainTimeSeries)
{
    let algo;
    if (algoType === 'linear')
    {
        algo = new linear();
    }
    else if (algoType === 'hybrid')
    {
        algo = new hybrid();
    }
    algo.learnNormal(trainTimeSeries)
    return algo;
}

const anomalyIdentificator = async (trainSet, testSetInput, algoType) =>
{
    let {Keys, vals, testP, trainTimeSeries} = initValues(trainSet, testSetInput);

    let algo = whichAlgo(algoType, trainTimeSeries);

    let corrFeatures = algo.getCorrelationFeatures();

    let timeSeriesTest = new TimeSeries(testP);

    let anomalies = algo.detect(timeSeriesTest);

    let valuesAndKey = new Map()

    setMapValues(Keys, valuesAndKey, vals);

    let topCorrelacted = new Map()

    setCorrelated(Keys, topCorrelacted, corrFeatures);

    let arr = new Array(anomalies.length)

    splitCorrelated(anomalies, arr, corrFeatures);

    return {
        anomalies: anomalies,
        keys: Keys,
        values: vals,
    };
}

module.exports.anomalyIdentificator = anomalyIdentificator