const csvExtention = '.csv';
function updateElementById(elementId, newVal) {
    document.getElementById(elementId).innerHTML = newVal;
}

function getFileName(filename) {
    let trainFile = document.getElementById(filename).files[0].name;
    return trainFile;
}

function deleteInvalidFiles(testFlag, trainFlag) {
    if (!(testFlag && trainFlag)) {
        if (document.getElementById("trainSetInput").files.length !== 0) {
            delete document.getElementById("trainSetInput").files
            document.getElementById('trainSetInput').value = "";
        }
        if (document.getElementById("testSetInput").files.length !== 0) {
            delete document.getElementById("testSetInput").files
            document.getElementById('testSetInput').value = "";
        }
    }
}



function checkTrainFile(trainFlag) {
    if (document.getElementById("trainSetInput").files.length !== 0) {
        let trainFile = getFileName("trainSetInput");
        let trainSize = trainFile.length;
        let train_suffix = getFileExtention(trainFile, trainSize);
        if (train_suffix === csvExtention) {
            trainFlag = true;
            updateElementById("trainSetInvalid", "");
        } else {
            console.log(trainFlag)
            updateElementById("trainSetInvalid", "Invalid file format");
        }
    } else {
        updateElementById("trainSetInvalid", "Enter train file");
    }
    return trainFlag;
}

function getFileExtention(testFile, testSize) {
    let test_suffix = testFile.substr(testSize - 4, testSize);
    return test_suffix;
}

function checkTestFile(testFlag) {
    if (document.getElementById("testSetInput").files.length !== 0) {
        let testFile = getFileName("testSetInput");
        let testSize = testFile.length;

        // get the file extention
        let test_suffix = getFileExtention(testFile, testSize);
        if (test_suffix === csvExtention) {
            testFlag = true;
            updateElementById("testSetInvalid", "");
        } else {
            updateElementById("testSetInvalid", "Invalid file format");
        }
    } else {
        updateElementById("testSetInvalid", "Enter test file");
    }
    return testFlag;
}

function detectAnomalies() {
    console.log("hello")
    let trainFlag = false, testFlag = false;
    trainFlag = checkTrainFile(trainFlag);
    console.log(trainFlag);
    testFlag = checkTestFile(testFlag);
    deleteInvalidFiles(testFlag, trainFlag);

  }
