// Read CSV dataset from filesystem and store it in a variable

async function readCSVFile(fileName) {
    return new Promise((resolve, reject) => {
        let dataset = Object();
        let indexing = Object();
        
        d3.csv(fileName, function(data) {
            // Convert the CSV into an array of objects
            if (Number(data[""]) < 7 && Number(data[""]) >= 0) {
                //??
            } else {
                if (data["Content type:"] === "Category") {
                    indexing = Object.keys(data).map(key => data[key]).splice(1);
                    for (let i = 0; i < indexing.length; i++) {
                        dataset[indexing[i]] = new Array();
                    }
                } else {
                    delete data[""];
                    for (let i = 0; i < indexing.length; i++) {
                        const dat = Object.values(data);
                        dataset[indexing[i]].push(dat[i]);
                    }
                }
            }
        }).then(function() {
            console.log("Dataset loaded");
            resolve(dataset);
        });
    });
}

function getValuesAtIndex(obj, index) {
    /**
     * Returns an array containing the values at the specified index for all object properties.
     * @param {Object} obj - The object to extract values from.
     * @param {number} index - The index to extract values from.
     * @returns {Array} - An array containing the values at the specified index for all object properties.
     */
    return Object.entries(obj).map(([key, value]) => value[index]);

}
  
function getRegexMatches(data, regex) {
    return data.reduce((acc, cur) => {
        if (cur.match(regex) !== null) {
            acc++;
        }
        return acc;
    }, 0);
}


// Wait for readCSVFile to finish reading the file
async function readData() {
    let dataset = await readCSVFile("medecines.csv");
    //console.log(dataset);

    // Get all unique values in field "Therapeutic area"
    let therapeuticAreas = new Set(dataset["Therapeutic area"]);
    // Convert the set to a array
    therapeuticAreas = Array.from(therapeuticAreas);

    //console.log(therapeuticAreas);

    const oncology_regex = /\b\w+(?:oma|emia)\b/g;
    // Neuroscience regex
    const neuroscience_regex = /\b\w+(?:phrenia|phobia|drome|algia|itis|osis|pathy|paresis|plegia|pnea|rrhea|sthenia|trophy)\b/g;
    // COVID regex
    const covid_regex = /\b\w+(?:covid|corona|sars|virus|pandemic|epidemic|influenza|flu|vaccine|vaccination|viral|virus|virology|viral|virologist|virological|virologists|virologies|virologicall)\b/g;


    // Get count of values matching oncology_regex in dataset["Therapeutic area"]
    const oncology_count = getRegexMatches(dataset["Therapeutic area"], oncology_regex);
    // Get count of values matching neuroscience_regex in dataset["Therapeutic area"]
    const neuroscience_count = getRegexMatches(dataset["Therapeutic area"], neuroscience_regex);
    // Get count of values matching covid_regex in dataset["Therapeutic area"]
    const covid_count = getRegexMatches(dataset["Therapeutic area"], covid_regex);

    // Log the counts
    console.log("Oncology count: " + oncology_count);
    console.log("Neuroscience count: " + neuroscience_count);
    console.log("COVID count: " + covid_count);
    
    return dataset;
}


// Create the icicle plot
async function createIciclePlot() {
    let dataset = await readData();
    console.log("Placeholder icicle plot function");
}

createIciclePlot();
