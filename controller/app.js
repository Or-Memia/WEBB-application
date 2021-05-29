const lineNumberTableInHtml = 24;

const {myExpress, convertJsonToHtml, myFileUpload, model, lineReader, FormData, fetch, path} = importModules();
const app = myExpress()
const serverPort = 8080;
const resultsTableHtml =
    {
        "<>": "tr", "html":
            [
                {"<>": "td", "html": "${description}"},
                {"<>": "td", "style": "text-align: center", "html": "${timeStep}"},
            ]
    }
function StartAppUsing() {
    app.use(myExpress.urlencoded({
        extended: false
    }))
    app.use(myFileUpload({}))
    app.use(myExpress.static('view'))
}

StartAppUsing();

function AppGet() {
    app.get('/', (req, res) => {
        res.sendFile('view/index.html')
    })
}

AppGet();

function getRequestVals(req) {
    let trainFile = req.files.trainSetInput
    let testSetInput = req.files.testSetInput
    let algorithmType = req.body.chosenAlgorithm
    return {trainFile, testSetInput, algorithmType};
}

function appPostAnomalies() {
    app.post('/', (req, res) => {
        //get values from view
        let {trainFile, testSetInput, algorithmType} = getRequestVals(req);
        model.detectAnomalies(trainFile.data.toString(), testSetInput.data.toString(), algorithmType).then((result) => {
            res.contentType("application/json")
            res.send(JSON.stringify(result.anomalies))
            res.end()
        })
    })
}

appPostAnomalies();

console.log("Hello World");
function WriteRows(lineReaderStreamer, res) {
    let row;
    row = lineReaderStreamer.next();
    let i;
    for (i = 0; i < lineNumberTableInHtml; i++)
    {
        res.write(row)
        row = lineReaderStreamer.next()
    }
    return row;
}

function postInfo(res, result) {
    let lineReaderStreamer;
    lineReaderStreamer = new lineReader(path.join(__dirname, '../view/AnomalyResults.html'));
    let row = WriteRows(lineReaderStreamer, res);

    let report = JSON.stringify(result);
    let html = convertJsonToHtml.render(report, resultsTableHtml);
    res.write(html)
    while (row = lineReaderStreamer.next()) {
        res.write(row)}
    res.end()
}

function getInput(req) {
    const AnomaliesDetectorInput = new FormData()
    AnomaliesDetectorInput.append("trainSetInput", req.files.trainSetInput.data)
    AnomaliesDetectorInput.append("testSetInput", req.files.testSetInput.data)
    AnomaliesDetectorInput.append("chosenAlgorithm", req.body.chosenAlgorithm)
    return AnomaliesDetectorInput;
}

function AppPostTableResults() {
    app.post('/detect', (req, res) => {
        if (req.files) {
            const AnomaliesDetectorInput = getInput(req);
            console.log(req.body.chosenAlgorithm);
            fetch(('http://localhost:8080/'), {
                method: 'POST',
                body: AnomaliesDetectorInput
            }).then(result => result.json())
                .then((result) => {
                    postInfo(res, result);
                })
        }
    })
}

AppPostTableResults();

function importModules() {
    const myExpress = require('express')
    const convertJsonToHtml = require('node-json2html');
    const myFileUpload = require('express-fileupload')
    const myModel = require('../model/detectAnomalies')
    const readLines = require('n-readlines');
    const resultData = require('form-data')
    const myFetch = require('node-fetch')
    const myPath = require('path');
    return {myExpress: myExpress, convertJsonToHtml: convertJsonToHtml, myFileUpload: myFileUpload, model: myModel, lineReader: readLines, FormData: resultData, fetch: myFetch, path: myPath};
}

app.listen(serverPort, () => console.log("Go to http://localhost:8080"))