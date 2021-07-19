async function covidcase() {
    var margin = {top: 30, right: 120, bottom: 30, left: 175},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        tooltip = {width: 100, height: 100, x: 10, y: -30};

    data = await d3.csv("data/covid-us-states-group-date.csv")

    var parseDate = d3.timeParse("%Y-%m-%d"),
        bisectDate = d3.bisector(function (d) {
            return d.date;
        }).left,
        formatValue = d3.format(","),
        dateFormatter = d3.timeFormat("%Y-%m-%d");

    var x = d3.scaleTime()
        .range([0, width]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom(x).tickFormat(dateFormatter);
    var yAxis = d3.axisLeft(y).tickFormat(d3.format("s"))

    var line = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.cases);
        });

    var svg = d3.select("#chart1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    data.forEach(function (d) {
        d.date = parseDate(d.date);
        d.cases = +d.cases;
    });

    data.sort(function (a, b) {
        return a.date - b.date;
    });

    x.domain([data[0].date, data[data.length - 1].date]);
    y.domain(d3.extent(data, function (d) {
        return d.cases;
    }));
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("text-decoration", "underline")
        .text("Cases due to Covid-19");

    svg.append("g")
        .attr("class", "axisRed")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-20)");

    svg.append("g")
        .attr("class", "axisRed")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of cases")
        .style("fill", "Blue");

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat("")
        );

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        // .transition().duration(3000).delay(1000)
        .style("fill", "#69b3a2")
        .attr("stroke-width", 2.5)

    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("circle")
        .attr("r", 5);

    focus.append("rect")
        .attr("class", "tooltip")
        .attr("width", 100)
        .attr("height", 50)
        .attr("x", 10)
        .attr("y", -22)
        .attr("rx", 4)
        .attr("ry", 4);

    focus.append("text")
        .attr("class", "tooltip-date")
        .attr("x", 18)
        .attr("y", -2);

    focus.append("text")
        .attr("x", 18)
        .attr("y", 18)
        .text("Cases:");

    focus.append("text")
        .attr("class", "tooltip-case")
        .attr("x", 60)
        .attr("y", 18);

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .style("opacity", 0)
        .on("mouseover", function () {
            focus.style("display", null);
        })
        .on("mouseout", function () {
            focus.style("display", "none");
        })
        .on("mousemove", mousemove);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.cases) + ")");
        focus.select(".tooltip-date").text(dateFormatter(d.date));
        focus.select(".tooltip-case").text(formatValue(d.cases));
    }
}