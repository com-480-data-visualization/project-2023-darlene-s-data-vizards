// Define a function that takes a list of numbers and draws a histogram with d3.js
export function histogram(data, color, title) {
	console.log("Histogram function called with data: ", data);

	// Filter out NaN values
	const filteredData = data.filter(d => !isNaN(d));

	// Declare the chart dimensions and margins.
	const width = window.innerWidth *0.6;
	const height = window.innerHeight /2;
	const marginTop = 64;
	const marginRight = 0;
	const marginBottom = 64;
	const centerX = window.innerWidth / 2;
	const marginLeft = centerX - width/2;

	// Group data by year
	const groupedData = d3.group(filteredData, d => d);

	// Generate histogram data
	const histogramData = Array.from(groupedData, ([year, values]) => ({
		year: +year,
		count: values.length,
	}));

	// Create the x scale
	const xScale = d3.scaleLinear()
		// .domain([d3.min(histogramData, d => d.year), d3.max(histogramData, d => d.year)])
		.domain([2016, 2023])
		.range([marginLeft + width/8, width - width/8]);

	// Create the y scale
	const yScale = d3.scaleLinear()
		.domain([0, d3.max(histogramData, d => d.count)])
		.range([height - marginBottom, marginTop]);

	// Create the SVG container
	const svg = d3.create("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [0, 0, width, height])
		.attr("style", "max-width: 100%; height: auto;");

	// Add rectangles for each bin
	svg.selectAll("rect")
		.data(histogramData)
		.join("rect")
		.attr("x", d => xScale(d.year) - (xScale(1) - xScale(0)) / 2)
		.attr("y", d => yScale(d.count))
		.attr("width", xScale(1) - xScale(0)) // Use a fixed width for each bin
		.attr("height", d => yScale(0) - yScale(d.count))
		.attr("fill", color);

	// Add x-axis
	svg.append("g")
		.attr("transform", `translate(0, ${height - marginBottom})`)
		.call(d3.axisBottom(xScale)
			.tickValues(histogramData.map(d => d.year))
			.tickFormat(d3.format("d"))
			)
		.call(g => g.select(".domain").remove())
		.append("text")
		.attr("x", centerX)
		.attr("y", marginBottom-16)
		.attr("fill", "currentColor")
		.style("text-anchor", "middle")
		.text("Marketing authorization year")
		.classed("axis-label", true);

	// Add y-axis
	svg.append("g")
		.attr("transform", `translate(${marginLeft}, 0)`)
		.call(d3.axisLeft(yScale).ticks(height / 40))
		.call(g => g.select(".domain").remove())
		.append("text")
		.attr("x", -16)
		.attr("y", marginTop - 16)
		.attr("fill", "currentColor")
		.attr("text-anchor", "start")
		.text("Medicine counts")
		.classed("axis-label", true);

	// Add the title
	svg.append("text")
		.attr("x", centerX)
		.attr("y", marginTop - 16)
		.attr("text-anchor", "middle")
		.text(title);
	

	// Append the SVG to the container element
	const container = document.getElementById('histogram');
	container.innerHTML = '';
	container.appendChild(svg.node());
}
  