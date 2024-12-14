// ScatterPlot.tsx
import { useEffect } from 'react';
import * as d3 from 'd3';

type Props = {
  data: { SepalLengthCm: number; SepalWidthCm: number; PetalLengthCm: number; PetalWidthCm: number; Species: string }[];
};

const ScatterPlot: React.FC<Props> = ({ data }) => {
  useEffect(() => {
    // Set up margins and dimensions for the SVG container
    const margin = { top: 10, right: 10, bottom: 50, left: 50 }; // Increased bottom and left margin for axis labels
    const width = 500 - margin.left - margin.right; // Total width minus left and right margins
    const height = 500 - margin.top - margin.bottom; // Total height minus top and bottom margins

    // Create the SVG element and apply margins
    const svg = d3.select("#scatter-plot")
      .attr("width", width + margin.left + margin.right)  // Set total width including margin
      .attr("height", height + margin.top + margin.bottom)  // Set total height including margin
      .append("g")  // Create a group element to apply transformation
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");  // Apply margin translation

    // Ensure we remove previous points before re-drawing
    svg.selectAll("*").remove(); // This removes all previous elements in the svg

    // Create X scale based on the SepalLengthCm values
    const x = d3.scaleLinear()
      .domain([d3.min(data, (d) => d.SepalLengthCm) || 0, d3.max(data, (d) => d.SepalLengthCm) || 0])  // Set the domain to the min and max values of SepalLengthCm
      .range([0, width]);  // Map the domain to the width of the SVG

    // Create Y scale based on the SepalWidthCm values
    const y = d3.scaleLinear()
      .domain([d3.min(data, (d) => d.SepalWidthCm) || 0, d3.max(data, (d) => d.SepalWidthCm) || 0])  // Set the domain to the min and max values of SepalWidthCm
      .range([height, 0]);  // Map the domain to the height of the SVG (reverse because SVG Y axis goes down)

    // Create circles for each data point (scatter plot dots)
    svg.append("g")
      .selectAll(".dot")
      .data(data)  // Bind data
      .enter()
      .append("circle")  // Create a circle for each data point
      .attr("cx", (d) => x(d.SepalLengthCm))  // Set X position based on SepalLengthCm
      .attr("cy", (d) => y(d.SepalWidthCm))  // Set Y position based on SepalWidthCm
      .attr("r", 3)  // Set radius for the circle (dot size)
      .style("fill", "steelblue");  // Set color for the dots

    // Append the X axis to the bottom of the plot
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")  // Position the X axis at the bottom
      .call(d3.axisBottom(x))  // Create the bottom axis using the X scale
      .append("text")
      .attr("x", width / 2)  // Position the X axis label centered horizontally
      .attr("y", 30)  // Position the label slightly below the axis
      .style("text-anchor", "middle")  // Center the label
      .text("Sepal Length (cm)");  // Label text for the X axis

    // Append the Y axis to the left of the plot
    svg.append("g")
      .call(d3.axisLeft(y))  // Create the left axis using the Y scale
      .append("text")
      .attr("transform", "rotate(-90)")  // Rotate the Y axis label to make it vertical
      .attr("y", -40)  // Position the label slightly to the left of the axis
      .attr("x", -height / 2)  // Center the label vertically
      .style("text-anchor", "middle")  // Center the label
      .text("Sepal Width (cm)");  // Label text for the Y axis

  }, [data]);  // Re-run the effect if the data changes

  return (
    <div>
      <h2>Scatter Plot: Sepal Length vs Sepal Width</h2>
      {/* Render the scatter plot */}
      <svg id="scatter-plot"></svg>
    </div>
  );
};

export default ScatterPlot;
