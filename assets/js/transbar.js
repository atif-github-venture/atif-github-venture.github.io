async function transbarinit() {
    var fileName = "./data/other_death.csv";

    var deathCause = ["Heart disease", "Covid-19", "Cancer","Stroke", "Respiratory disease","Accidents","Diabetes",
        "Alzheimer","Influenza","Kidney disease","Septicemia"]
    var makeVis = function (stateMap) {
        // Define dimensions of vis
        var margin = {top: 30, right: 50, bottom: 80, left: 100},
            width = 1000 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // Make x scale
        var xScale = d3.scaleBand()
            .domain(deathCause)
            .rangeRound([0, width], 0.1);

        // Make y scale, the domain will be defined on bar update
        var yScale = d3.scaleLinear()
            .range([height, 0]);

        // Create canvas
        var canvas = d3.select("#chart5")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var xAxis = d3.axisBottom(xScale)

        canvas.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis).selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-15)");

        var yAxis = d3.axisLeft(yScale);

        var yAxisHandleForUpdate = canvas.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        yAxisHandleForUpdate.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Deaths");

        var updateBars = function (data) {
            // First update the y-axis domain to match data
            yScale.domain(d3.extent(data));
            yAxisHandleForUpdate.call(yAxis);

            var bars = canvas.selectAll(".bar").data(data);

            // Add bars for new data
            bars.enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", function (d, i) {
                    return xScale(deathCause[i]);
                })
                .attr("width", xScale.bandwidth()-15)
                .attr("y", function (d, i) {
                    return yScale(d);
                })
                .attr("height", function (d, i) {
                    // console.log("h: "+ yScale(d))
                    return height - yScale(d);
                });

            // Update old ones, already have x / width from before
            bars
                .transition().duration(250)
                .attr("y", function (d, i) {
                    return yScale(d);
                })
                .attr("height", function (d, i) {
                    return height - yScale(d);
                });

            // Remove old ones
            bars.exit().remove();
        };

        // Handler for dropdown value change
        var dropdownChange = function () {
            var newstate = d3.select(this).property('value'),
                newData = stateMap[newstate];

            updateBars(newData);
        };

        // Get names of states, for dropdown
        var states = Object.keys(stateMap).sort();

        var dropdown = d3.select("#chart5")
            .insert("select", "svg")
            .on("change", dropdownChange);

        dropdown.selectAll("option")
            .data(states)
            .enter().append("option")
            .attr("value", function (d) {
                return d;
            })
            .text(function (d) {
                return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
            });

        var initialData = stateMap[states[0]];
        updateBars(initialData);
        canvas.append('text')
            .attr('class', 'title')
            .attr('x', 350)
            .attr('y', 40)
            .style("font-size", "18px")
            .attr('text-anchor', 'middle')
            .text('Exploration: Covid-19 & Other Leading Cause of Death per State')
        canvas.append('text')
            .attr('class', 'label')
            .attr('x', width-10)
            .attr('y', height+25)
            .attr('text-anchor', 'middle')
            .style("font-size", "12px")
            .style("fill", "red")
            .text('Causes of death')
    };

    data = await d3.csv(fileName)
    var stateMap = {};
    data.forEach(function (d) {
        var state = d.STATE;
        stateMap[state] = [];
        deathCause.forEach(function (field) {
            stateMap[state].push(+d[field]);
        });
    });
    // console.log(stateMap)
    makeVis(stateMap);



}