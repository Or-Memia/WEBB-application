const csvExtention = '.csv';

//function update element according to given id
function updateElementById(elementId, newVal) {
    document.getElementById(elementId).innerHTML = newVal;}

//function return the file name
function getFileName(filename) {
    let trainFile = document.getElementById(filename).files[0].name;
    return trainFile;
}

//the function delete files that aren't csv files and reset and wait for the correct files
function deleteInvalidFiles(testFlag, trainFlag) {
    if (!(testFlag && trainFlag)) {
        if (document.getElementById("trainSetInput").files.length !== 0) {
            delete document.getElementById("trainSetInput").files
            document.getElementById('trainSetInput').value = "";}
        if (document.getElementById("testSetInput").files.length !== 0) {
            delete document.getElementById("testSetInput").files
            document.getElementById('testSetInput').value = "";}
        // Hide the results if invalid input was given
        document.getElementById("table").style.display = "none";
    }else
    {
        // if everything is ok - reveal the table results
        document.getElementById("table").style.display = "block";
    }
}

//the function check if given file is csv file and if user enter csv file,  operate according to that.
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
            updateElementById("trainSetInvalid", "Invalid file format");}
    } else {
        updateElementById("trainSetInvalid", "Enter train file");}
    return trainFlag;
}

function getFileExtention(testFile, testSize) {
    let test_suffix = testFile.substr(testSize - 4, testSize);
    return test_suffix;
}

//function check if given file is csv file and if user enter csv file, operate according to that.
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
            updateElementById("testSetInvalid", "Invalid file format");}
    } else {
        updateElementById("testSetInvalid", "Enter test file");}
    return testFlag;
}

//function check a given files and operate for find anomaly
function detectAnomalies() {
    console.log("hello")
    let trainFlag = false, testFlag = false;
    trainFlag = checkTrainFile(trainFlag);
    console.log(trainFlag);
    testFlag = checkTestFile(testFlag);
    deleteInvalidFiles(testFlag, trainFlag);
  }
