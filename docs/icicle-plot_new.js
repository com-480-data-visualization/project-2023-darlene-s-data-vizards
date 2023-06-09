import { histogram } from "./histogram.js";

function grabMedecineNamesFromGraph(curr_focus) {
	// Create an empty array to store the results
	let medicineNames = [];
  
	// Recurse over the children key, until it doesn't exist anymore
	if (curr_focus.children) {
	  	curr_focus.children.forEach((child) => {
			// Concatenate the results of each recursive call to the medicineNames array
			medicineNames = medicineNames.concat(grabMedecineNamesFromGraph(child));
		});
	} else {
	  	// If children doesn't exist, add the data key to the array
	  	medicineNames.push(curr_focus.data.date);
	}
  
	// Return the accumulated array of medicine names
	return medicineNames;
}
  

// Create the zoomable treemap plot (https://observablehq.com/@d3/zoomable-treemap)
  let format = d3.format(",d")
  let height = window.innerHeight*0.6;
  let width = window.innerWidth ;
  let name = d => d.ancestors().reverse().map(d => d.data.name).join("/")
  let counter = 0;


  function tile(node, x0, y0, x1, y1) {
    d3.treemapBinary(node, 0, 0, width, height);
    for (const child of node.children) {
      child.x0 = x0 + child.x0 / width * (x1 - x0);
      child.x1 = x0 + child.x1 / width * (x1 - x0);
      child.y0 = y0 + child.y0 / height * (y1 - y0);
      child.y1 = y0 + child.y1 / height * (y1 - y0);
    }
  }

  const treemap = data => d3.treemap()
      .tile(tile)
    (d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value))


  const fetchData = async () => {
    const response = await fetch('dataset.json');
    const data = await response.json();
    const hierarchy = d3.hierarchy(data, d => d.children);
    return hierarchy;
  };

  fetchData().then(dataset => {
    const svgElement = chart(dataset.data);
    document.getElementById("icicle-plot").appendChild(svgElement);
  });

  fetchData().then(dataset => {
    // Plot histogram
    const histogram_data = grabMedecineNamesFromGraph(dataset).flat();
    histogram_data.splice(histogram_data.indexOf(undefined), 1);
    const title = dataset.data.name;
    histogram(histogram_data, title);
  });

  // Plot histogram
  const histogram_data = grabMedecineNamesFromGraph(fetchData).flat();
  histogram_data.splice(histogram_data.indexOf(undefined), 1);
  const title = fetchData.data.name;
  histogram(histogram_data, title);

  function chart(data) {
    const x = d3.scaleLinear().rangeRound([0, width]);
    const y = d3.scaleLinear().rangeRound([0, height]);

    const svg = d3.create("svg")
        .attr("viewBox", [0.5, -30.5, width, height + 32])
        .style("font", "14px Tenor Sans");

    let group = svg.append("g")
        .call(render, treemap(data));

    function render(group, root) {
      const node = group
        .selectAll("g")
        .data(root.children.concat(root))
        .join("g");

      node.filter(d => d === root ? d.parent : d.children)
          .attr("cursor", "pointer")
          .on("click", (event, d) => d === root ? zoomout(root) : zoomin(d));

      node.append("title")
          .text(d => `${name(d)}\n${format(d.value)}`)

      node.append("rect")
        .attr("id", (d) => {
          if (!d.leafUid) {
            d.leafUid = `leaf-${counter}`;
            counter++;
          }
          return d.leafUid;
        })
        .attr("fill", d => d === root ? "#0D353F" : d.children ? "#8128AD" : "#8128AD")
        .attr("stroke", "#fff")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);;
    
      node.append("clipPath")
        .attr("id", (d) => {
          if (!d.clipUid) {
            d.clipUid = `clip-${counter}`;
            counter++;
          }
          return d.clipUid;
        })
        .append("use")
        .attr("xlink:href", (d) => `#${d.leafUid}`);

      node.append("text")
          .attr("clip-path", d => d.clipUid)
          .attr("font-weight", d => d === root ? "bold" : null)
        .selectAll("tspan")
        .data(d => (d === root ? name(d) : d.data.name).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
        .join("tspan")
          .attr("x", 3)
          .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
          .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
          .attr("font-weight", (d, i, nodes) => i === nodes.length - 1 ? "normal" : null)
          .text(d => d)
          .attr("fill", "#fff");

      group.call(position, root);
    }

    function handleMouseOver(event, d) {
      d3.select(this)
      .attr("fill", "#0D353F")      
    }
  
    function handleMouseOut(event, d) {
      d3.select(this)
      .attr("fill", "#8128AD")
    }

    function position(group, root) {
      group.selectAll("g")
          .attr("transform", d => d === root ? `translate(0,-30)` : `translate(${x(d.x0)},${y(d.y0)})`)
        .select("rect")
          .attr("width", d => d === root ? width : x(d.x1) - x(d.x0))
          .attr("height", d => d === root ? 30 : y(d.y1) - y(d.y0));
    }

    // When zooming in, draw the new nodes on top, and fade them in.
    function zoomin(d) {
      const group0 = group.attr("pointer-events", "none");
      const group1 = group = svg.append("g").call(render, d);

      x.domain([d.x0, d.x1]);
      y.domain([d.y0, d.y1]);

      svg.transition()
          .duration(750)
          .call(t => group0.transition(t).remove()
            .call(position, d.parent))
          .call(t => group1.transition(t)
            .attrTween("opacity", () => d3.interpolate(0, 1))
            .call(position, d));

      // Plot histogram
			const histogram_data = grabMedecineNamesFromGraph(d).flat();
			histogram_data.splice(histogram_data.indexOf(undefined), 1);
      const title = d.data.name;
			histogram(histogram_data, title);
    }


    // When zooming out, draw the old nodes on top, and fade them out.
    function zoomout(d) {
      const group0 = group.attr("pointer-events", "none");
      const group1 = group = svg.insert("g", "*").call(render, d.parent);

      x.domain([d.parent.x0, d.parent.x1]);
      y.domain([d.parent.y0, d.parent.y1]);

      svg.transition()
          .duration(750)
          .call(t => group0.transition(t).remove()
            .attrTween("opacity", () => d3.interpolate(1, 0))
            .call(position, d))
          .call(t => group1.transition(t)
            .call(position, d.parent));

      // Plot histogram
			const histogram_data = grabMedecineNamesFromGraph(d.parent).flat();
			histogram_data.splice(histogram_data.indexOf(undefined), 1);
      const title = d.parent.data.name;
			histogram(histogram_data, title);
    }

    return svg.node();
  }
