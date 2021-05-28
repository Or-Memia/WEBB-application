  function uploadFiles() {

    let correctLearn = false, correctAnomaly = false;
    if (document.getElementById("learnFile").files.length === 0) {
        document.getElementById("learnError").innerHTML = "Enter train file";
    } else {
        let learn = document.getElementById("learnFile").files[0].name;
        let size = learn.length;
        let suffix = learn.substr(size - 4, size);
        if (suffix === '.csv') {
            correctLearn = true;
            document.getElementById("learnError").innerHTML = "";
        } else {
            document.getElementById("learnError").innerHTML = "Invalid file format";
        }
    }
    if (document.getElementById("anomalyFile").files.length === 0) {
        document.getElementById("anomalyError").innerHTML = "Enter test file";
    } else {
        let anomaly = document.getElementById("anomalyFile").files[0].name;
        let size = anomaly.length;
        let suffix = anomaly.substr(size - 4, size);
        if (suffix === '.csv') {
            correctAnomaly = true;
            document.getElementById("anomalyError").innerHTML = "";
        } else {
            document.getElementById("anomalyError").innerHTML = "Invalid file format";
        }
    }
    if (!(correctAnomaly && correctLearn)){
        if (document.getElementById("learnFile").files.length !== 0){
            delete document.getElementById("learnFile").files
            document.getElementById('learnFile').value = "";
        }
        if(document.getElementById("anomalyFile").files.length !== 0){
            delete document.getElementById("anomalyFile").files
            document.getElementById('anomalyFile').value = "";
        }
    }

}
