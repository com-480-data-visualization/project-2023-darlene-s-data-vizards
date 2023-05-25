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

		
		// Field: Oncology
		const oncology_regex = /\b(?:oncology|cancer(?:ous)?|tumou?r(?:ous)?|leukemia(?:tic)?)\b/gi;

		// Field: Neurology
		const neurology_regex = /\b(?:neurology|neuro(?:genesis|logy)?|brain|spinal|cereb(?:ellum|ral)?|phrenia|nervou?s?|phobia|osis|pathy|paresis|plegia|trophy(?:ic)?)\b/gi;

		// Field: Infectious Diseases
		const infectious_regex = /\b(?:infectious|infection|bacteria|virus|pathogen|microbe|parasite)\b/gi;

		// Field: Cardiology
		const cardiology_regex = /\b(?:cardiology|heart|cardio(?:vascular)?|blood(?: pressure)?|tension|tensive)\b/gi;

		// Field: Respiratory Medicine
		const respiratory_regex = /\b(?:respiratory|respiration|pneu(?:monia)?|chial|broncho(?:genic|spasm))\b/gi;

		// Field: Endocrinology
		const endocrinology_regex = /\b(?:endocrinology|endocrine|hormone|thyroid|diabetes|insulin|glucagon)\b/gi;

		// Field: Gastroenterology
		const gastroenterology_regex = /\b(?:gastroenterology|gastro(?:intestinal)?|stomach|intestinal|digestion|gut|colitis|gastritis)\b/gi;

		// Field: Dermatology
		const dermatology_regex = /\b(?:dermatology|dermato(?:logy)?|skin|epidermis|rash|eczema|psoriasis)\b/gi;

		// Field: Ophthalmology
		const ophthalmology_regex = /\b(?:ophthalmology|ophthalmic|eye|vision|retina|cornea|cataract)\b/gi;

		// Field: Orthopedics
		const orthopedics_regex = /\b(?:orthopedics|orthopedic|bone|joint|musculoskeletal|fracture|arthritis|osteoporosis|scoliosis|kyphosis|spine|orthopedist)\b/gi;

		// Field: Urology
		const urology_regex = /\b(?:urology|uro(?:logy)?|urinary|bladder|kidney|prostate|nephro(?:logy)?|cystitis|urolithiasis|urination)\b/gi;

		// Field: Obstetrics and Gynecology
		const obstetrics_gynecology_regex = /\b(?:obstetrics(?: and gynecology)?|gynecology|obstetric|pregnancy|obstetrician|gynecologic|obstetrical|menstruation|reproductive|menopause|endometriosis|pelvic|cervical|ovarian)\b/gi;

		// Field: Pediatrics
		const pediatrics_regex = /\b(?:pediatrics|pediatric|child|children|infant|neonatal|adolescent|paediatric|pediatrician|peds|pediatry|pediatrist)\b/gi;

		// Field: Psychiatry
		const psychiatry_regex = /\b(?:psychiatry|psychiatric|psychology|mental|psychosis|schizophrenia|depression|anxiety|bipolar|psychologist|psychiatrist)\b/gi;

		// Field: Radiology
		const radiology_regex = /\b(?:radiology|radiologic|imaging|x-ray|ultrasound|CT(?: scan)?|MRI|nuclear|radiographer|radiologist)\b/gi;

		// Field: Anesthesiology
		const anesthesiology_regex = /\b(?:anesthesiology|anesthetic|anesthesia|anesthesiologist|sedation|anesthetist|anesthetize|anesthetic|analgesia|anesthetization)\b/gi;

		// Field: Hematology
		const hematology_regex = /\b(?:hematology|hematologic|blood|anemia|leukemia|lymphoma|platelet|erythrocyte|coagulation|hemoglobin|hematologist)\b/gi;

		// Field: Allergy and Immunology
		const allergy_immunology_regex = /\b(?:allergy(?: and immunology)?|immunology|allergic|allergen|allergist|immune|immunity|hypersensitivity|autoimmune|immunologist)\b/gi;

		// Field: Nephrology
		const nephrology_regex = /\b(?:nephrology|nephro(?:logy)?|kidney|renal|glomerulonephritis|nephritis|nephropathy|nephrologist|renal failure|renal insufficiency)\b/gi;



		const oncology_count = getRegexMatches(dataset["Therapeutic area"], oncology_regex);
		const neurology_count = getRegexMatches(dataset["Therapeutic area"], neurology_regex);
		const infectious_count = getRegexMatches(dataset["Therapeutic area"], infectious_regex);
		const cardiology_count = getRegexMatches(dataset["Therapeutic area"], cardiology_regex);
		const respiratory_count = getRegexMatches(dataset["Therapeutic area"], respiratory_regex);
		const endocrinology_count = getRegexMatches(dataset["Therapeutic area"], endocrinology_regex);
		const gastroenterology_count = getRegexMatches(dataset["Therapeutic area"], gastroenterology_regex);
		const dermatology_count = getRegexMatches(dataset["Therapeutic area"], dermatology_regex);
		const ophthalmology_count = getRegexMatches(dataset["Therapeutic area"], ophthalmology_regex);
		const orthopedics_count = getRegexMatches(dataset["Therapeutic area"], orthopedics_regex);
		const urology_count = getRegexMatches(dataset["Therapeutic area"], urology_regex);
		const obstetrics_gynecology_count = getRegexMatches(dataset["Therapeutic area"], obstetrics_gynecology_regex);
		const pediatrics_count = getRegexMatches(dataset["Therapeutic area"], pediatrics_regex);
		const psychiatry_count = getRegexMatches(dataset["Therapeutic area"], psychiatry_regex);
		const radiology_count = getRegexMatches(dataset["Therapeutic area"], radiology_regex);
		const anesthesiology_count = getRegexMatches(dataset["Therapeutic area"], anesthesiology_regex);
		const hematology_count = getRegexMatches(dataset["Therapeutic area"], hematology_regex);
		const allergy_immunology_count = getRegexMatches(dataset["Therapeutic area"], allergy_immunology_regex);
		const nephrology_count = getRegexMatches(dataset["Therapeutic area"], nephrology_regex);

		const other_count = dataset["Therapeutic area"].length - oncology_count - neurology_count - infectious_count - cardiology_count - respiratory_count - endocrinology_count - gastroenterology_count - dermatology_count - ophthalmology_count;

		// Make an array with all the counts
		const counts = [oncology_count, neurology_count, infectious_count, cardiology_count, respiratory_count, endocrinology_count, gastroenterology_count, dermatology_count, ophthalmology_count, orthopedics_count, urology_count, obstetrics_gynecology_count, pediatrics_count, psychiatry_count, radiology_count, anesthesiology_count, hematology_count, allergy_immunology_count, nephrology_count, other_count];

		// Make an array with all the labels
		const labels = ["Oncology", "Neurology", "Infectious", "Cardiology", "Respiratory", "Endocrinology", "Gastroenterology", "Dermatology", "Ophthalmology", "Orthopedics", "Urology", "Obstetrics and Gynecology", "Pediatrics", "Psychiatry", "Radiology", "Anesthesiology", "Hematology", "Allergy and Immunology", "Nephrology", "Other"];

		// Make an array with all the regexes
		const regexes = [oncology_regex, neurology_regex, infectious_regex, cardiology_regex, respiratory_regex, endocrinology_regex, gastroenterology_regex, dermatology_regex, ophthalmology_regex, orthopedics_regex, urology_regex, obstetrics_gynecology_regex, pediatrics_regex, psychiatry_regex, radiology_regex, anesthesiology_regex, hematology_regex, allergy_immunology_regex, nephrology_regex];

		// print the counts
		console.log("Counts:", counts);

		console.log("Top 10 oncology sub-categories", findTopKSubstrings(getRegexMatchesArray(dataset["Therapeutic area"], oncology_regex), 10));

		// Formatted dataset for Icicle plot
		dataset = {
				name: "all",
				children: [
					// Generate the children from the counts, labels, and regexes. Make sure to not include the "Other" category
					...counts.slice(0, counts.length - 1).map((count, i) => {
						return {
							name: labels[i],
							value: count,
							children: getSubclassData(dataset["Therapeutic area"], regexes[i])
						}
					})
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
