function deleteInvalidFiles(testFlag, trainFlag) {
    if (!(testFlag && trainFlag)) {
        if (document.getElementById("learnFile").files.length !== 0) {
            delete document.getElementById("learnFile").files
            document.getElementById('learnFile').value = "";
        }
        if (document.getElementById("anomalyFile").files.length !== 0) {
            delete document.getElementById("anomalyFile").files
            document.getElementById('anomalyFile').value = "";
        }
    }
}

function checkTrainFile(trainFlag) {
    if (document.getElementById("learnFile").files.length !== 0) {
        let trainFile = document.getElementById("learnFile").files[0].name;
        let trainSize = trainFile.length;
        let train_suffix = trainFile.substr(trainSize - 4, trainSize);
        if (train_suffix === '.csv') {
            trainFlag = true;
            document.getElementById("learnError").innerHTML = "";
        } else {
            document.getElementById("learnError").innerHTML = "Invalid file format";
        }
    } else {
        document.getElementById("learnError").innerHTML = "Enter train file";
    }
    return trainFlag;
}

function checkTestFile(testFlag) {
    if (document.getElementById("anomalyFile").files.length !== 0) {
        let testFile = document.getElementById("anomalyFile").files[0].name;
        let testSize = testFile.length;
        let test_suffix = testFile.substr(testSize - 4, testSize);
        if (test_suffix === '.csv') {
            testFlag = true;
            document.getElementById("anomalyError").innerHTML = "";
        } else {
            document.getElementById("anomalyError").innerHTML = "Invalid file format";
        }
    } else {
        document.getElementById("anomalyError").innerHTML = "Enter test file";
    }
    return testFlag;
}

function detectAnomalies() {

    let trainFlag = false, testFlag = false;
    trainFlag = checkTrainFile(trainFlag);
    testFlag = checkTestFile(testFlag);
    deleteInvalidFiles(testFlag, trainFlag);

  }
