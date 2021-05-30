const lineNumberTableInHtml = 24;

const {myExpress, convertJsonToHtml, myFileUpload, model, lineReader, FormData, fetch, path} = importModules();
const server = myExpress()
const serverPort = 8080;
const resultsTableHtml =
    {
        "<>": "tr", "html":
            [
                {"<>": "td", "html": "${description}"},
                {"<>": "td", "style": "text-align: center", "html": "${timeStep}"},
            ]
    }


// Start website on 8080 localhost
startWebApp();



// Functions
function importModules() {
    const myFetch = require('node-fetch')
    const convertJsonToHtml = require('node-json2html');
    const myFileUpload = require('express-fileupload')
    const myModel = require('../model/AnomalyIdentificator')
    const myExpress = require('express')
    const resultData = require('form-data')
    const myPath = require('path');
    const readLines = require('n-readlines');
    return {myExpress: myExpress, convertJsonToHtml: convertJsonToHtml, myFileUpload: myFileUpload, model: myModel, lineReader: readLines, FormData: resultData, fetch: myFetch, path: myPath};
}
function AppPostTableResults() {
    server.post('/detect', (req, res) => {
        if (req.files) {
            const AnomaliesDetectorInput = getInput(req);
            console.log(req.body.chosenAlgorithm);
            fetch(('http://localhost:8080/'),
                {
                    method: 'POST',
                    body: AnomaliesDetectorInput
                }).then(result => result.json())
                .then((result) => {
                    postInfo(res, result);
                })
        }
    })
}
function StartAppUsing() {
    server.use(myExpress.urlencoded({
        extended: false
    }))
    server.use(myFileUpload({}))
    server.use(myExpress.static('view'))
}
function getInput(req) {
    const AnomaliesDetectorInput = new FormData()
    AnomaliesDetectorInput.append("trainSetInput", req.files.trainSetInput.data)
    AnomaliesDetectorInput.append("testSetInput", req.files.testSetInput.data)
    AnomaliesDetectorInput.append("chosenAlgorithm", req.body.chosenAlgorithm)
    return AnomaliesDetectorInput;
}
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
    while (row = lineReaderStreamer.next())
    {
        res.write(row)
    }
    res.end()
}
function getRequestVals(req) {
    let trainFile = req.files.trainSetInput
    let testSetInput = req.files.testSetInput
    let algorithmType = req.body.chosenAlgorithm
    return {trainFile, testSetInput, algorithmType};
}
function appPostAnomalies() {
    server.post('/', (req, res) => {
        //get values from view
        let {trainFile, testSetInput, algorithmType} = getRequestVals(req);
        model.detectAnomalies(trainFile.data.toString(), testSetInput.data.toString(), algorithmType).then((result) => {
            res.contentType("application/json")
            res.send(JSON.stringify(result.anomalies))
            res.end()
        })
    })
}
function AppGet() {
    server.get('/', (req, res) => {
        res.sendFile('view/index.html')
    })
}
function startWebApp() {
    StartAppUsing();
    AppGet();
    appPostAnomalies();
    console.log("Hello World");
    AppPostTableResults();
    server.listen(serverPort, () => console.log("Go to http://localhost:8080"))
}

