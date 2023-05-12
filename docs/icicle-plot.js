// Read CSV dataset from filesystem and store it in a variable

var dataset = Object();
var indexing = Object();

d3.csv("medecines.csv", function(data) {
    //Convert the CSV into an array of objects
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
});

console.log(dataset);
