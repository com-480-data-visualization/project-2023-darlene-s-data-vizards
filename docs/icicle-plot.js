// Read CSV dataset from filesystem and store it in a variable

async function readTextFile(fileName) {
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

// Wait for readTextFile to finish reading the file
async function readData() {
    let dataset = await readTextFile("medecines.csv");
    console.log(dataset);
    return dataset;
}


// Create the icicle plot
async function createIciclePlot() {
    let dataset = await readData();
    console.log("Placeholder icicle plot function");
}

createIciclePlot();
