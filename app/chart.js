async function drawBars() {
  const dataset = await d3.json("./data/my_weather_data.json");
  const xAccessor = (d) => d.humidity;
  const yAccessor = (d) => d.length;

  const width = 600;

  let dimensions = {
    width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  wrapper.attr("role", "figure").attr("tabindex", "0");
  wrapper
    .append("title")
    .text(
      "Histogram looking at the distribution of humidity in 2021 in New York City"
    );

  const bounds = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    );

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  console.log(xScale.domain());
  console.log(xScale.range());

  const binsGenerator = d3
    .bin()
    .domain(xScale.domain())
    .value(xAccessor)
    .thresholds(12);

  const bins = binsGenerator(dataset);

  console.log(bins);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const binsGroup = bounds
    .append("g")
    .attr("tabindex", "0")
    .attr("role", "list")
    .attr("aria-label", "histogram bars");

  // const binGroups = binsGroup.selectAll("g").data(bins).join("g");
  const binGroups = binsGroup
    .selectAll("g")
    .data(bins)
    .enter()
    .append("g")
    .attr("tabindex", "0")
    .attr("role", "listitem")
    .attr(
      "aria-label",
      (d) =>
        `There were ${yAccessor(d)} days between ${d.x0
          .toString()
          .slice(0, 4)} and ${d.x1.toString().slice(0, 4)} humidity levels.`
    );

  const barPadding = 1;
  const barRects = binGroups
    .append("rect")
    .attr("x", (d) => xScale(d.x0) + barPadding / 2)
    .attr("y", (d) => yScale(yAccessor(d)))
    .attr("width", (d) => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
    .attr("height", (d) => dimensions.boundedHeight - yScale(yAccessor(d)));

  const barText = binGroups
    .filter(yAccessor)
    .append("text")
    .attr("x", (d) => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
    .attr("y", (d) => yScale(yAccessor(d)) - 5)
    .text(yAccessor);

  const mean = d3.mean(dataset, xAccessor);

  const meanLine = bounds
    .append("line")
    .attr("x1", xScale(mean))
    .attr("x2", xScale(mean))
    .attr("y1", -15)
    .attr("y2", dimensions.boundedHeight)
    .attr("class", "mean");

  const meanLabel = bounds
    .append("text")
    .attr("x", xScale(mean))
    .attr("y", -20)
    .text(`mean ${mean}`)
    .attr("fill", "maroon");

  const xAxisGenerator = d3.axisBottom().scale(xScale);

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("class", "x-axis-label")
    .text("Humidity");

  wrapper
    .selectAll("text")
    .attr("role", "presentation")
    .attr("aria-hidden", "true");

  const tooltip = d3.select("#tooltip");

  const onMouseEnter = (event, d) => {
    tooltip.select("#count").text(yAccessor(d));
    const formatHumidity = d3.format(".2f");
    tooltip
      .select("#range")
      // .text([d.x0, d.x1].join(" - "));
      .text([formatHumidity(d.x0), formatHumidity(d.x1)].join(" - "));
    const x =
      xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2 + dimensions.margin.left;
    const y = yScale(yAccessor(d)) + dimensions.margin.top;
    // tooltip.style("transform", `translate(${x}px, ${y}px)`);
    tooltip.style(
      "transform",
      `translate(calc( -50% + ${x}px), calc(-100% + ${y}px))`
    );
    tooltip.style("opacity", 1);
  };

  const onMouseLeave = (event, d) => {
    tooltip.style("opacity", 0);
  };

  binGroups
    .select("rect")
    .on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave);
}

drawBars();
