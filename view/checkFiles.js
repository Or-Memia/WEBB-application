  function uploadFiles() {

    let correctLearn = false, correctAnomaly = false;
    if (document.getElementById("learnFile").files.length === 0) {
        document.getElementById("learnError").innerHTML = "Please choose a learn file";
    } else {
        let learn = document.getElementById("learnFile").files[0].name;
        let size = learn.length;
        let suffix = learn.substr(size - 4, size);
        if (suffix === '.csv') {
            correctLearn = true;
            document.getElementById("learnError").innerHTML = "";
        } else {
            document.getElementById("learnError").innerHTML = "This file must be a CSV file";
        }
    }
    if (document.getElementById("anomalyFile").files.length === 0) {
        document.getElementById("anomalyError").innerHTML = "Please choose an anomaly file";
    } else {
        let anomaly = document.getElementById("anomalyFile").files[0].name;
        let size = anomaly.length;
        let suffix = anomaly.substr(size - 4, size);
        if (suffix === '.csv') {
            correctAnomaly = true;
            document.getElementById("anomalyError").innerHTML = "";
        } else {
            document.getElementById("anomalyError").innerHTML = "This file must be a CSV file";
        }
    }
    if (correctAnomaly && correctLearn){
        let removeButton = document.getElementById("upload");
        removeButton.remove();
        document.getElementById("submit").innerHTML = '    <input type="submit" class="upload-button" value="upload files" >'
    }

}
