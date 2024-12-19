import React from "react";
import * as d3 from "d3";
import { geoPath, geoNaturalEarth1 } from "d3-geo";
import * as topojson from "topojson-client";
import { useData } from "../hooks/useData";

interface ChoroplethMapProps {
  onCountrySelect: (country: string) => void;
}

const ChoroplethMap: React.FC<ChoroplethMapProps> = ({ onCountrySelect }) => {
  const { data } = useData();
  const mapRef = React.useRef(null);

  const countryTotalUsers = React.useMemo(() => {
    if (!data) return new Map();
    return data.reduce((acc, row) => {
      const country =
        row.Country === "United States"
          ? "United States of America"
          : row.Country;
      acc.set(country, (acc.get(country) || 0) + 1);
      return acc;
    }, new Map());
  }, [data]);

  React.useEffect(() => {
    if (!data) return;

    const width = 800;
    const height = 500;

    const svg = d3
      .select(mapRef.current)
      .style("display", "block")
      .style("margin", "0 auto")
      .attr("width", width)
      .attr("height", height);

    // Create tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(255, 255, 255, 0.9)")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
      .style("font-size", "12px")
      .style("color", "black")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    const projection = geoNaturalEarth1()
      .scale(150)
      .translate([width / 2, height / 2]);
    const pathGenerator = geoPath().projection(projection);

    d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    ).then((world: any) => {
      const countries = topojson.feature(
        world,
        world.objects.countries
      ).features;

      const maxUsers = d3.max(Array.from(countryTotalUsers.values())) || 1;
      const colorScale = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0, maxUsers]);

      svg.selectAll("*").remove();

      // Draw countries with click interaction
      svg
        .append("g")
        .selectAll("path")
        .data(countries)
        .join("path")
        .attr("d", pathGenerator)
        .attr("fill", (d) => {
          const countryName = d.properties?.name;
          const userCount = countryTotalUsers.get(countryName) || 0;
          return userCount ? colorScale(userCount) : "#c0c0c0";
        })
        .attr("stroke", "#333")
        .style("cursor", "pointer")
        .on("click", (event, d) => {
          const countryName = d.properties?.name;
          onCountrySelect(
            countryName === "United States of America"
              ? "United States"
              : countryName
          );
        })
        .on("mouseover", function (event, d) {
          const countryName = d.properties?.name;
          const userCount = countryTotalUsers.get(countryName) || 0;

          // Highlight the country
          d3.select(this).style("opacity", 1).style("stroke-width", "2");

          // Show tooltip
          tooltip.style("visibility", "visible").html(`
              <strong>${countryName}</strong><br/>
              Users: ${userCount}
            `);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", function () {
          // Reset country highlight
          d3.select(this).style("opacity", 1).style("stroke-width", "1");

          // Hide tooltip
          tooltip.style("visibility", "hidden");
        });

      // Add legend
      const legendWidth = 300;
      const legendHeight = 10;
      const legend = svg
        .append("g")
        .attr(
          "transform",
          `translate(${width - legendWidth - 20}, ${height - 40})`
        );

      const legendScale = d3
        .scaleLinear()
        .domain([0, maxUsers])
        .range([0, legendWidth]);

      const legendGradient = legend
        .append("defs")
        .append("linearGradient")
        .attr("id", "legend-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

      legendGradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d3.interpolateBlues(0));
      legendGradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d3.interpolateBlues(1));

      legend
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#legend-gradient)");

      legend
        .append("text")
        .attr("x", legendWidth / 2)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .style("fill", "#fff")
        .text("Total Users");

      legend
        .append("text")
        .attr("x", 0)
        .attr("y", legendHeight + 15)
        .style("fill", "#fff")
        .text("0");

      legend
        .append("text")
        .attr("x", legendWidth)
        .attr("y", legendHeight + 15)
        .style("fill", "#fff")
        .attr("text-anchor", "end")
        .text(`${maxUsers}`);
    });

    return () => {
      svg.selectAll("*").remove();
      d3.selectAll(".tooltip").remove(); // Clean up tooltip
    };
  }, [data, countryTotalUsers, onCountrySelect]);

  return <svg ref={mapRef}></svg>;
};

export default ChoroplethMap;
