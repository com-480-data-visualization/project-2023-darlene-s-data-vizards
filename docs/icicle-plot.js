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
		}).catch(function (error) {
			console.error("Failed to read the file:", error);
			reject(error);
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

function getValuesAtIndexVectorized(obj, indexes) {
	/**
	 * Returns an array containing the values at the specified indexes for all object properties.
	 * @param {Object} obj - The object to extract values from.
	 * @param {Array} indexes - The indexes to extract values from.
	 * @returns {Array} - An array containing the values at the specified indexes for all object properties.
	 **/

	return Object.keys(obj).reduce((acc, key) => {
		if (Array.isArray(obj[key])) {
		  	const indexedValues = indexes.map(index => obj[key][index]).filter(value => value !== undefined);
		  	acc[key] = indexedValues;
		}
		return acc;
	  }, {});
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

// Get the indexes of all values matching regex in data
function getRegexMatchesIndexes(data, regex) {
	return data.reduce((acc, cur, index) => {
		if (cur.match(regex) !== null) {
			acc.push(index);
		}
		return acc;
	}, []);
}


function findTopKSubstrings(array, k) {
	/**
	 * Finds the top-k most common substrings in an array of strings
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

function truncateString(str, delimiter) {
	const delimiterIndex = str.indexOf(delimiter);
	if (delimiterIndex !== -1) {
		return str.substring(0, delimiterIndex);
	}
	return str;
}

// Get data for subclass
function getSubclassData(full_data, dataset_to_search, subclass_regex) {
	const matchArray = getRegexMatchesArray(dataset_to_search, subclass_regex);
	const subclassNames = findTopKSubstrings(matchArray, 10);
	const totalSubclassCount = matchArray.length;
	const match_indexes = getRegexMatchesIndexes(dataset_to_search, subclass_regex);
	// ---
	const matching_full_dataset = getValuesAtIndexVectorized(full_data, match_indexes);
	// ---

	const childrenData = subclassNames.map((subclass) => {
		const count = getRegexMatches(matchArray, subclass);

		// Keep the "Medecine name" and "First published" fields only!
		const mini_medicines = Object({"name": matching_full_dataset["Medicine name"], "date": matching_full_dataset["First published"]})

		// Find the top-k medecines in the subclass
		const medicines = findTopKSubstrings(mini_medicines["name"], 5)
		// INFO: The value of k will greatly, greatly affect the performance of the visualization

		// Find to which elements the medecines correspond in mini_medecines
		const medicine_indexes = medicines.map((medicine) => {
			return mini_medicines["name"].indexOf(medicine);
		});
		// Subset the mini_medecines object to only keep the medecines in medecine_indexes
		
		const medicines_subset = getValuesAtIndexVectorized(mini_medicines, medicine_indexes);
		
		// Remove everything past the year in the dates
		let medicines_subset_year = Object({"name": medicines_subset["name"], "date": medicines_subset["date"].map((date) => {return truncateString(date, "-")})});

		// Add the value: 1 field into the medecines_subset_year object
		medicines_subset_year["value"] = medicines_subset_year["name"].map((name) => {return 1});

		// Switch this object of arrays to an array of objects
		const maxLength = Object.values(medicines_subset_year).reduce((max, arr) => {
			const length = arr.length;
			return length > max ? length : max;
		}, 0);

		// Array of objects
		const ret = Array.from({length: maxLength}, (_, i) => {
			return Object.fromEntries(Object.entries(medicines_subset_year).map(([k, v]) => [k, v[i]]));
		});

		return {
			name: subclass,
			value: count,
			// Map the medecines to the correct format
			children: ret
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

	// Add all of these into an array
	const regexes = [oncology_regex, neurology_regex, infectious_regex, cardiology_regex, respiratory_regex, endocrinology_regex, gastroenterology_regex, dermatology_regex, ophthalmology_regex, orthopedics_regex, urology_regex, obstetrics_gynecology_regex, pediatrics_regex, psychiatry_regex, radiology_regex, anesthesiology_regex, hematology_regex, allergy_immunology_regex, nephrology_regex];

	// Make an array generated by getRegexMatches for each field
	const counts = regexes.map((regex) => getRegexMatches(dataset["Therapeutic area"], regex));
	// Add the "Other" category
	counts.push(dataset["Therapeutic area"].length - counts.reduce((sum, count) => sum + count, 0));

	// Make an array with all the labels
	const labels = ["Oncology", "Neurology", "Infectious", "Cardiology", "Respiratory", "Endocrinology", "Gastroenterology", "Dermatology", "Ophthalmology", "Orthopedics", "Urology", "Obstetrics and Gynecology", "Pediatrics", "Psychiatry", "Radiology", "Anesthesiology", "Hematology", "Allergy and Immunology", "Nephrology", "Other"];

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
						children: getSubclassData(dataset, dataset["Therapeutic area"], regexes[i])
					}
				})
			],
		};
	
	console.log("Dataset:", dataset);

	return dataset;
}

function getMedecineInfo(data, medecineName) {
	// Find at which index the medecine is located
	const index = data["Medicine name"].findIndex((name) => name === medecineName);

	const fetched = getValuesAtIndex(data, index);

	return fetched;
}

function grabMedecineNamesFromGraph(curr_focus) {
	// Recurse over the children key, until it doesn't exist anymore. If it doesn't exist, add the data key to the array
	if (curr_focus.children) {
		return curr_focus.children.map((child) => grabMedecineNamesFromGraph(child));
	}
	else {
		return curr_focus.data.date;
	}
}


// Create the icicle plot
async function createIciclePlot() {
	// Get our formatted dataset
	let dataset = await readData();
  
	// Define the dimensions of the SVG container
	const width = window.innerWidth;
	const height = window.innerHeight;
  
	// Color scale
	const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, dataset.children.length + 2))
  
	// Number formatter
	const format = d3.format(",d");
  
	// Create the hierarchical structure from data
	const partition = data => {
	  	const root = d3.hierarchy(data)
			.sum(d => d.value)
			.sort((a, b) => b.value - a.value);
	  	return d3.partition()
			.size([height, (root.height + 1) * width / 4])
			.padding(0)
			(root);
		};
  
	// Create the icicle plot (https://observablehq.com/@d3/zoomable-icicle)
	function chart() {
		const root = partition(dataset);
		let focus = root;
		let currentFocus;

		const svg = d3.create("svg")
			.attr("viewBox", [0, 0, width, height]);
  
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
  
	  	// Adjust opacity conditions to include fourth level
	  	rect.attr("fill-opacity", d => d.depth <= 3 ? 0.6 : 0);
	  	text.attr("fill-opacity", d => d.depth <= 3 ? +labelVisible(d) : 0);
	  	tspan.attr("fill-opacity", d => d.depth <= 3 ? labelVisible(d) * 0.7 : 0);
  
	  	function clicked(event, p) {
			focus = focus === p ? p = p.parent : p;
			currentFocus = p;

			// Current focus has everything we need to draw the histogram!!
			const histogram_data = grabMedecineNamesFromGraph(currentFocus);

			histogram(histogram_data);
		
			root.each(function (d) {
			  d.target = {
				x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
				x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
				y0: d.y0 - p.y0,
				y1: d.y1 - p.y0
			  };
			});
		
			const t = cell.transition().duration(750)
			  .attr("transform", d => `translate(${d.target.y0},${d.target.x0})`);
		
			rect.transition(t)
			  .attr("height", d => rectHeight(d.target))
			  .attr("fill-opacity", d => (d.depth <= focus.depth + 1 || d.parent === focus) ? 0.6 : 0);
		
			text.transition(t)
			  .attr("fill-opacity", d => (d.depth <= focus.depth + 1 || d.parent === focus) ? +labelVisible(d.target) : 0);
		
			tspan.transition(t)
			  .attr("fill-opacity", d => (d.depth <= focus.depth + 1 || d.parent === focus) ? labelVisible(d.target) * 0.7 : 0);
	  	}
	  
	  	// Adjust height calculation based on size proportion
	  	function rectHeight(d) {
			return d.x1 - d.x0;
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