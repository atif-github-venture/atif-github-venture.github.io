async function covidDeathAlter() {
    var margin = {top: 30, right: 120, bottom: 30, left: 150},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        tooltip = {width: 100, height: 100, x: 10, y: -30};

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
            return y(d.deaths);
        });

    var svg = d3.select("#chart6").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data = await d3.csv("data/covid-us-states-group-date.csv")

    data.forEach(function (d) {
        d.date = parseDate(d.date);
        d.deaths = +d.deaths;
    });


    x.domain([data[0].date, data[data.length - 1].date]);
    y.domain(d3.extent(data, function (d) {
        return d.deaths;
    }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Number of deaths");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

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
        .text("deaths:");

    focus.append("text")
        .attr("class", "tooltip-deaths")
        .attr("x", 60)
        .attr("y", 18);

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
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
        focus.attr("transform", "translate(" + x(d.date) + "," + y(d.deaths) + ")");
        focus.select(".tooltip-date").text(dateFormatter(d.date));
        focus.select(".tooltip-deaths").text(formatValue(d.deaths));
    }

}