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

// Get count of values matching regex in data
function getRegexMatches(data, regex) {
		return data.reduce((acc, cur) => {
				if (cur.match(regex) !== null) {
						acc++;
				}
				return acc;
		}, 0);
}

// Get all values matching regex in data
function getRegexMatchesArray(data, regex) {
		return data.reduce((acc, cur) => {
				if (cur.match(regex) !== null) {
						acc.push(cur);
				}
				return acc;
		}, []);
}

function findTopKSubstrings(array, k) {
	/**
	 * Finds the top-k most common substrings in an array of strings, NOT TESTED
	 * @param {Array} array - The array of strings to search.
	 * @param {number} k - The number of substrings to return.
	 * @returns {Array} - An array containing the top-k most common substrings.
	 * @example
	 */

	const substringCounts = {};
	
	// Split the string into substrings using the "; " or ", " delimiters
	array.forEach((string) => {
		const substrings = string.split(/; |, /);
		// Strip whitespace from substrings
		substrings.forEach((substring, index) => {
			substrings[index] = substring.trim();
		});
		// Count the number of times each substring occurs
		substrings.forEach((substring) => {
			if (substringCounts[substring] === undefined) {
				substringCounts[substring] = 1;
			} else {
				substringCounts[substring]++;
			}
		});
	});
	

	// Sort substrings by count
	const sortedSubstrings = Object.keys(substringCounts).sort((a, b) => {
		return substringCounts[b] - substringCounts[a];
	});

	// Return top-k substrings
	return sortedSubstrings.slice(0, k);
}

// Get data for subclass
function getSubclassData(dataset, subclass_regex) {
	const subclassNames = findTopKSubstrings(getRegexMatchesArray(dataset, subclass_regex), 100);
	const totalSubclassCount = getRegexMatches(getRegexMatchesArray(dataset, subclass_regex), "");

	const childrenData = subclassNames.map((subclass) => {
		const count = getRegexMatches(getRegexMatchesArray(dataset, subclass_regex), subclass);
		return {
			name: subclass,
			value: count,
		};
	});

	const topSubclassCount = childrenData.reduce((sum, subclass) => sum + subclass.value, 0);
	const otherCount = totalSubclassCount - topSubclassCount;

	childrenData.push({
		name: "other",
		value: otherCount,
	});

	return childrenData;
}



// Wait for readCSVFile to finish reading the file
async function readData() {
		let dataset = await readCSVFile("medecines.csv");

		// Get all unique values in field "Therapeutic area"
		let therapeuticAreas = new Set(dataset["Therapeutic area"]);
		// Convert the set to a array
		therapeuticAreas = Array.from(therapeuticAreas);

		
		const oncology_regex = /\b\w+(?:oma|emia)\b/g;
		// Neuroscience regex
		const neuroscience_regex = /\b\w+(?:phrenia|phobia|drome|algia|itis|osis|pathy|paresis|plegia|pnea|rrhea|sthenia|trophy)\b/g;
		// COVID regex
		const covid_regex = /\b\w+(?:covid|corona|sars|virus|pandemic|epidemic|influenza|flu|vaccine|vaccination|viral|virus|virology|viral|virologist|virological|virologists|virologies|virologicall)\b/g;
		// Respiratory diseases regex
		const respiratory_regex = /\b\w+(?:pneu|chial|broncho)\b/g;
		// Cardiovascular diseases regex
		const cardiovascular_regex = /\b\w+(?:cardio|vascular|heart|blood|hypertension|hypotension|hypertensive|hypotensive|hypertensives|hypotensives|hypertensions|hypotensions)\b/g;
		// Diabetes regex
		const diabetes_regex = /\b\w+(?:diabetes|insulin|glucagon)\b/g;
		// Metabolic diseases regex
		const metabolic_regex = /\b\w+(?:metaboli)\b/g;


		// Get count of values matching oncology_regex in dataset["Therapeutic area"]
		const oncology_count = getRegexMatches(dataset["Therapeutic area"], oncology_regex);
		// Get count of values matching neuroscience_regex in dataset["Therapeutic area"]
		const neuroscience_count = getRegexMatches(dataset["Therapeutic area"], neuroscience_regex);
		// Get count of values matching covid_regex in dataset["Therapeutic area"]
		const covid_count = getRegexMatches(dataset["Therapeutic area"], covid_regex);
		// Get count of values matching respiratory_regex in dataset["Therapeutic area"]
		const respiratory_count = getRegexMatches(dataset["Therapeutic area"], respiratory_regex);
		// Get count of values matching cardiovascular_regex in dataset["Therapeutic area"]
		const cardiovascular_count = getRegexMatches(dataset["Therapeutic area"], cardiovascular_regex);
		// Get count of values matching diabetes_regex in dataset["Therapeutic area"]
		const diabetes_count = getRegexMatches(dataset["Therapeutic area"], diabetes_regex);
		// Get count of values matching metabolic_regex in dataset["Therapeutic area"]
		const metabolic_count = getRegexMatches(dataset["Therapeutic area"], metabolic_regex);
		// Get count of values not matching any of the above regexes
		const other_count = dataset["Therapeutic area"].length - oncology_count - neuroscience_count - covid_count - respiratory_count - cardiovascular_count - diabetes_count - metabolic_count;

		console.log("Dataset: ", dataset);

		// Log the counts
		console.log("dataset length: " + dataset["Therapeutic area"].length);
		console.log("Oncology count: " + oncology_count);
		console.log("Neuroscience count: " + neuroscience_count);
		console.log("COVID count: " + covid_count);
		console.log("Respiratory count: " + respiratory_count);
		console.log("Cardiovascular count: " + cardiovascular_count);
		console.log("Diabetes count: " + diabetes_count);
		console.log("Metabolic count: " + metabolic_count);
		console.log("Other count: " + other_count);

		console.log("Top 10 oncology sub-categories", findTopKSubstrings(getRegexMatchesArray(dataset["Therapeutic area"], oncology_regex), 10));

		// Formatted dataset for Icicle plot
		dataset = {
				name: "all",
				children: [
					{
						name: "oncology",
						value: oncology_count,
						children: getSubclassData(dataset["Therapeutic area"], oncology_regex),
					},
					{
						name: "neuroscience",
						value: neuroscience_count,
						children: getSubclassData(dataset["Therapeutic area"], neuroscience_regex),
					},
					{
						name: "covid",
						value: covid_count,
						children: getSubclassData(dataset["Therapeutic area"], covid_regex),
					},
					{
						name: "respiratory",
						value: respiratory_count,
						children: getSubclassData(dataset["Therapeutic area"], respiratory_regex),
					},
					{
						name: "cardiovascular",
						value: cardiovascular_count,
						children: getSubclassData(dataset["Therapeutic area"], cardiovascular_regex),
					},
					{
						name: "diabetes",
						value: diabetes_count,
						children: getSubclassData(dataset["Therapeutic area"], diabetes_regex),
					},
					{
						name: "cardiovascular",
						value: cardiovascular_count,
						children: getSubclassData(dataset["Therapeutic area"], cardiovascular_regex),
					},
					{
						name: "other",
						value: other_count,
					},
				],
			};
		
		return dataset;
} 

// Create the icicle plot
async function createIciclePlot() {
	// Get our formatted dataset
	let dataset = await readData();

	// Define the dimensions of the SVG container
	const width = window.innerWidth;
	const height = window.innerHeight;;

	// Color scale 
	const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, dataset.children.length + 1))

	// Number formatter
	const format = d3.format(",d");

	// Create the hierarchical structure from data
	const partition = data => {
		const root = d3.hierarchy(data)
			.sum(d => d.value)
			.sort((a, b) => b.value - a.value);
		return d3.partition()
			.size([height, (root.height + 1) * width / 3])
			(root);
	};

	// Create the icicle plot (https://observablehq.com/@d3/zoomable-icicle)
	function chart () {
		const root = partition(dataset);
		let focus = root;
	
		const svg = d3.create("svg")
				.attr("viewBox", [0, 0, width, height])
				// .style("font", "10px sans-serif");
	
		const cell = svg
			.selectAll("g")
			.data(root.descendants())
			.join("g")
				.attr("transform", d => `translate(${d.y0},${d.x0})`);
	
		const rect = cell.append("rect")
				.attr("width", d => d.y1 - d.y0 - 1)
				.attr("height", d => rectHeight(d))
				.attr("fill-opacity", 0.6)
				.attr("fill", d => {
					if (!d.depth) return "#ccc";
					while (d.depth > 1) d = d.parent;
					return color(d.data.name);
				})
				.style("cursor", "pointer")
				.on("click", clicked);
	
		const text = cell.append("text")
				.style("user-select", "none")
				.attr("pointer-events", "none")
				.attr("x", 4)
				.attr("y", 16)
				.attr("fill-opacity", d => +labelVisible(d));
	
		text.append("tspan")
				.text(d => d.data.name);
	
		const tspan = text.append("tspan")
				.attr("fill-opacity", d => labelVisible(d) * 0.7)
				.text(d => ` ${format(d.value)}`);
	
		cell.append("title")
				.text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
	
		function clicked(event, p) {
			focus = focus === p ? p = p.parent : p;
	
			root.each(d => d.target = {
				x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
				x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
				y0: d.y0 - p.y0,
				y1: d.y1 - p.y0
			});
	
			const t = cell.transition().duration(750)
					.attr("transform", d => `translate(${d.target.y0},${d.target.x0})`);
	
			rect.transition(t).attr("height", d => rectHeight(d.target));
			text.transition(t).attr("fill-opacity", d => +labelVisible(d.target));
			tspan.transition(t).attr("fill-opacity", d => labelVisible(d.target) * 0.7);
		}
		
		function rectHeight(d) {
			return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
		}
	
		function labelVisible(d) {
			return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16;
		}
		
		return svg.node();
	}

	// Call the chart function on our dataset
	const svgElement = chart(dataset);

	// Append the SVG element to the DOM
	document.getElementById("icicle-plot").appendChild(svgElement);
}

createIciclePlot();
