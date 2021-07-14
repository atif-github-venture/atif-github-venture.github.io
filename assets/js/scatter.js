async function scatterinit() {

    // set the dimensions and margins of the graph
    var margin = {top: 30, right: 120, bottom: 30, left: 160},
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#chart3")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    data = await d3.csv("data/covid-us-states-group-state.csv")

    // Add X axis

    var x = d3.scaleLinear()
        .domain([0, 80000])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-20)");
    svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 6)
        .style("fill", "Red")
        .text("Number of deaths");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 5000000])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));
    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .style("fill", "Blue")
        .attr("transform", "rotate(-90)")
        .text("Number of cases");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 4))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Covid-19: Cases Vs Deaths");

    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    var tooltip = d3.select("#chart3")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "yellow")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")


    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    function mouseover() {
        tooltip
            .style("opacity", 1)
    }

    var mousemove = function (d) {
        tooltip
            .html("State: " + d.state + "<br>Cases: "+ d.cases + "<br>Deaths: "+ d.deaths)
            .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d3.mouse(this)[1]) + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    function mouseout() {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    // Add dots
    var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .transition().duration(2000).delay(1000)
        .attr("cx", function (d) {
            return x(d.deaths);
        })
        .attr("cy", function (d) {
            return y(d.cases);
        })
        .attr("r", 5)
        .style("fill", function(d,i) { return colorArray[i]; })
        .style("opacity", 0.3)
        .style("stroke", "black")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout)
}