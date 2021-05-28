function importModules() {
    const express = require('express')
    const json2html = require('node-json2html');
    const fileUpload = require('express-fileupload')
    const model = require('../model/detectAnomalies')
    const lineReader = require('n-readlines');
    const FormData = require('form-data')
    const fetch = require('node-fetch')
    const path = require('path');
    return {express, json2html, fileUpload, model, lineReader, FormData, fetch, path};
}

const {express, json2html, fileUpload, model, lineReader, FormData, fetch, path} = importModules();
const app = express()
const serverPort = 8080;

function StartAppUsing() {
    app.use(express.urlencoded({
        extended: false
    }))
    app.use(fileUpload({}))
    app.use(express.static('view'))
}

StartAppUsing();

function AppGet() {
    app.get('/', (req, res) => {
        res.sendFile('view/index.html')
    })
}

AppGet();

function appPostAnomalies() {
    app.post('/', (req, res) => {
        //get values from view
        let trainFile = req.files.trainSetInput
        let testSetInput = req.files.testSetInput
        let algorithmType = req.body.chosenAlgorithm
        model.detectAnomalies(trainFile.data.toString(), testSetInput.data.toString(), algorithmType).then((result) => {
            res.contentType("application/json")
            res.send(JSON.stringify(result.anomalies))
            res.end()
        })
    })
}

appPostAnomalies();

console.log("Hello World");

function postInfo(res, result) {
    const lineReaderStreamer = new lineReader(path.join(__dirname, '../view/AnomalyResults.html'));

    let row = lineReaderStreamer.next()
    // TODO: why 22
    for (let i = 0; i < 22; i++) {
        res.write(row)
        row = lineReaderStreamer.next()
    }

    let template = {
        "<>": "tr", "html": [
            {"<>": "td", "html": "${description}"},
            {"<>": "td", "style": "text-align: center", "html": "${timeStep}"},
        ]
    }

    let report = JSON.stringify(result);
    let html = json2html.render(report, template);

    res.write(html)
    while (row = lineReaderStreamer.next()) {
        res.write(row)
    }
    res.end()
}

function AppPostTableResults() {
    app.post('/detect', (req, res) => {
        if (req.files) {

            const AnomaliesDetectorInput = new FormData()

            AnomaliesDetectorInput.append("trainSetInput", req.files.trainSetInput.data)
            AnomaliesDetectorInput.append("testSetInput", req.files.testSetInput.data)
            AnomaliesDetectorInput.append("chosenAlgorithm", req.body.chosenAlgorithm)
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

app.listen(serverPort, () => console.log("Go to http://localhost:8080"))