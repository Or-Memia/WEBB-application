const fs = require('fs')

class TimeSeries {
    constructor(CSVFileName) {
        try {
            this.mapValues = {}
            // read contents of the file
            const data = fs.readFileSync(CSVFileName, 'utf8');

            // split the contents by new line
            const lines = data.split(/\r?\n/).filter((line) => line.trim().length > 0);

            this.keys = lines[0].split(",");
            const numOfKeys = this.keys.length

            for (let i = 0; i < numOfKeys; i++) {
                this.mapValues[this.keys[i]] = []
            }

            for (let i = 1; i < lines.length; i++) {
                const splitLine = lines[i].split(",");
                for (let j = 0; j < this.keys.length; j++) {
                    this.mapValues[this.keys[j]].push(splitLine[j])
                }
            }
            this.numOfValuesRows = lines.length - 1;
        } catch (err) {
            console.error(err);
        }
    }

    getAttributeData(name) {
        return this.mapValues[name];
    }

    gettAttributes() {
        return this.keys;
    }

    getRowSize() {
        return this.mapValues[this.keys[0]].length;
    }

    getNumOfValuesRows(){
        return this.numOfValuesRows;
    }

    getMap(){
        return this.mapValues
    }
}

module.exports = TimeSeries