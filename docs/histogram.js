// Define a function that takes a list of numbers and draws a histogram with d3.js
export function histogram(data) {
	console.log("Histogram function called with data: ", data);


	// Select the SVG element on the page
	const svg = d3.select("svg");
	
	// Define the dimensions of the SVG
	const width = +svg.attr("width");
	const height = +svg.attr("height");
	const margin = { top: 20, right: 20, bottom: 20, left: 20 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;
	
	// Create an SVG group element and translate it to the margin top-left position
	const g = svg.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);
	
	// Create a scale for the x-axis based on the data
	const x = d3.scaleLinear()
		.domain([0, d3.max(data)])
		.range([0, innerWidth]);
	
	// Create a histogram generator
	const bins = d3.histogram()
		.domain(x.domain())
		.thresholds(x.ticks(10))(data);
	
	// Create a scale for the y-axis based on the maximum bin count
	const y = d3.scaleLinear()
		.domain([0, d3.max(bins, d => d.length)])
		.range([innerHeight, 0]);
	
	// Select all existing bars and remove them with transition
	g.selectAll("rect")
		.transition()
		.duration(500)
		.attr("height", 0)
		.remove();
	
	// Create the new bars of the histogram with transition
	g.selectAll("rect")
	  	.data(bins)
	  	.enter().append("rect")
			.attr("x", d => x(d.x0) + 1)
			.attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
			.attr("y", innerHeight)
			.attr("height", 0)
			.attr("fill", "steelblue")
	  	.transition()
	  	.duration(500)
			.attr("y", d => y(d.length))
			.attr("height", d => y(0) - y(d.length));
	
	// Create the x-axis
	g.select(".x-axis")
	  	.transition()
	  	.duration(500)
	  	.call(d3.axisBottom(x));
	
	// Create the y-axis
	g.select(".y-axis")
	  	.transition()
	  	.duration(500)
	  	.call(d3.axisLeft(y));
	
	// Update the x-axis label
	g.select(".x-axis-label")
	  	.text("X-axis Label");
	
	// Update the y-axis label
	g.select(".y-axis-label")
	  	.text("Y-axis Label");
	
	// Append the x-axis label if it doesn't exist
	if (g.select(".x-axis-label").empty()) {
	  	g.append("text")
			.attr("class", "x-axis-label")
			.attr("x", innerWidth / 2)
			.attr("y", innerHeight + margin.bottom - 5)
			.attr("text-anchor", "middle")
			.text("X-axis Label");
	}
	
	// Append the y-axis label if it doesn't exist
	if (g.select(".y-axis-label").empty()) {
	  	g.append("text")
			.attr("class", "y-axis-label")
			.attr("x", -innerHeight / 2)
			.attr("y", -margin.left + 10)
			.attr("text-anchor", "middle")
			.attr("transform", "rotate(-90)")
			.text("Y-axis Label");
	}
}
  