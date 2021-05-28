//imports modules
const express = require('express')
const json2html = require('node-json2html');
const fileUpload = require('express-fileupload')
const model = require('../model/detectAnomalies')
const lineReader = require('n-readlines');
const FormData = require('form-data')
const fetch= require('node-fetch')
const path = require('path');
const app = express()

//define app uses
app.use(express.urlencoded({
    extended: false
}))
app.use(fileUpload({}))
app.use(express.static('view'))

//Get Method for '/' url
app.get('/', (req, res) => {
    res.sendFile('index.html')
})
app.post('/', (req, res) => {
    //get values from view
    let trainFile = req.files.learnFile
    let anomalyFile = req.files.anomalyFile
    let algorithmType = req.body.selectedAlgo
    model.detectAnomalies(trainFile.data.toString(), anomalyFile.data.toString(), algorithmType).then((result) => {
        res.contentType("application/json")
        res.send(JSON.stringify(result.anomalies))
        res.end()
    })
})

console.log("Hello World");
//Post Method for '/search' url
app.post('/detect', (req, res) => {
    if (req.files) {

        // pass values to the model
        const data = new FormData()

        //create the post request
        data.append("learnFile", req.files.learnFile.data)
        data.append("anomalyFile", req.files.anomalyFile.data)
        data.append("selectedAlgo", req.body.selectedAlgo)
        console.log(req.body.selectedAlgo);
        fetch(('http://localhost:8080/'), {
            method: 'POST',
            body: data
        }).then(result => result.json())
            .then((result) => {

                const readLine = new lineReader(path.join(__dirname, '../view/display.html'));

                //read from the html file
                let line = readLine.next()
                for (let i = 0; i < 22; i++) {
                    res.write(line)
                    line = readLine.next()
                }

                let template = {
                    "<>": "tr", "html": [
                        {"<>": "td", "html": "${description}"},
                        {"<>": "td", "style": "text-align: center", "html": "${timeStep}"},
                    ]
                }

                //
                let report = JSON.stringify(result);
                let html = json2html.render(report, template);

                res.write(html)
                while (line = readLine.next()) {
                    res.write(line)
                }
                res.end()
            })
    }
})

//starting server on port 8080
app.listen(8080, () => console.log("server started at 8080"))