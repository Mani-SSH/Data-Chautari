import React, { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { geoPath, geoNaturalEarth1 } from "d3-geo";
import * as topojson from "topojson-client";
import { useData } from "../hooks/useData";

const ChoroplethMap = () => {
  const mapRef = useRef<SVGSVGElement | null>(null);
  const { data, isLoading, error } = useData();

  const countryTotalUsers = useMemo(() => {
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

  useEffect(() => {
    if (!data || isLoading || error) return;

    const width = 800;
    const height = 500;

    const svg = d3
      .select(mapRef.current)
      .style("display", "block") // Fix white space
      .style("margin", "0 auto") // Center the map
      .attr("width", width)
      .attr("height", height);

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

      // Clean-up existing content
      svg.selectAll("*").remove();

      // Tooltip
      const tooltip = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "#fff")
        .style("padding", "5px")
        .style("border", "1px solid #000")
        .style("border-radius", "5px")
        .style("font-size", "12px")
        .style("pointer-events", "none");

      // Draw countries
      svg
        .append("g")
        .selectAll("path")
        .data(countries)
        .join("path")
        .attr("d", pathGenerator)
        .attr("fill", (d: any) => {
          const countryName = d.properties.name;
          const userCount = countryTotalUsers.get(countryName) || 0;
          return userCount ? colorScale(userCount) : "#d0d0d0"; // Set missing data countries to a light gray
        })
        .attr("stroke", "#333")
        .on("mouseover", (event, d) => {
          // Use more robust country name extraction
          const countryName =
            d.properties?.name ||
            d.properties?.NAME ||
            d.id ||
            "Unknown Country";
          const userCount =
            countryTotalUsers.get(countryName) ||
            countryTotalUsers.get(countryName.replace(/\s+/g, " ")) ||
            "No data";

          // Ensure tooltip is visible and positioned correctly
          tooltip
            .style("visibility", "visible")
            .style("opacity", 1)
            .style("left", `${event.pageX + 20}px`)
            .style("top", `${event.pageY + 20}px`)
            .style("background-color", "rgba(255, 255, 255, 0.8)") // Semi-transparent background
            .style("color", "#333") // Set text color to a darker shade
            .style("padding", "10px") // Increase padding
            .style("border-radius", "5px") // Add some rounded corners
            .style("box-shadow", "0 2px 5px rgba(0, 0, 0, 0.1)") // Add a subtle shadow
            .html(`
              <strong>Country:</strong> ${countryName}<br/>
              <strong>Count:</strong> ${userCount}
            `);

          // console.log("Tooltip data:", { countryName, userCount });
        })
        .on("mousemove", (event) => {
          tooltip
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden").style("opacity", 0);
        });

      // Draw legend
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
      d3.select("div").remove(); // Remove tooltips
    };
  }, [data, isLoading, error, countryTotalUsers]);

  if (isLoading) return <div>Loading map...</div>;
  if (error) return <div>Error loading map: {error.message}</div>;

  return <svg ref={mapRef}></svg>;
};

export default ChoroplethMap;
