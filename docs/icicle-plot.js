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
        } else {
            console.log(indexing);
            delete data[""];
            for (let i = 0; i < indexing.length; i++) {
                const old_key = Object.keys(data)[i];
                const new_key = indexing[i];
                

                if (old_key !== new_key) {
                    Object.defineProperty(data, new_key,
                        Object.getOwnPropertyDescriptor(data, old_key));
                    delete data[old_key];
                }
            }
            // Delete all keys starting with "Unnamed"
            for (let i = 0; i < Object.keys(data).length; i++) {
                const key = Object.keys(data)[i];
                if (key.startsWith("Unnamed")) {
                    delete data[key];
                }
            }

            console.log(data);
        }
    }
});
