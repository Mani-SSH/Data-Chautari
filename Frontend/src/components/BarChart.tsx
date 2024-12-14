// BarChart.tsx
import { useEffect } from 'react';
import * as d3 from 'd3';

type Props = {
  data: { Species: string }[];
};

const BarChart: React.FC<Props> = ({ data }) => {
  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const speciesCount = d3.rollup(
      data,
      (v) => v.length,
      (d) => d.Species
    );

    const x = d3.scaleBand()
      .domain(Array.from(speciesCount.keys()))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(Array.from(speciesCount.values())) || 0])
      .nice()
      .range([height, 0]);

    svg.selectAll(".bar")
      .data(Array.from(speciesCount.entries()))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d[0]) || 0)
      .attr("y", (d) => y(d[1]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d[1]))
      .attr("fill", "steelblue");

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y));
  }, [data]);

  return (
    <div>
      <h2>Species Distribution (Bar Chart)</h2>
      <svg id="bar-chart"></svg>
    </div>
  );
};

export default BarChart;
