async function barinit() {
    const sample = [
        {
            disease: 'Heart\ndisease',
            value: 650573,
            color: '#000000'
        },{
            disease: 'Covid-19',
            value: 596967,
            color: '#507dca'
        },
        {
            disease: 'Cancer',
            value: 558161,
            color: '#00a2ee'
        },
        {
            disease: 'Stroke',
            value: 143348,
            color: '#fbcb39'
        },
        {
            disease: 'Respiratory\ndisease',
            value: 130801,
            color: '#007bc8'
        },
        {
            disease: 'Accidents',
            value: 117602,
            color: '#65cedb'
        },
        {
            disease: 'Diabetes',
            value: 74927,
            color: '#ff6e52'
        },
        {
            disease: 'Alzheimer',
            value: 71487,
            color: '#f9de3f'
        },
        {
            disease: 'Influenza',
            value: 62903,
            color: '#5d2f8e'
        },
        {
            disease: 'Kidney\ndisease',
            value: 43833,
            color: '#008fc9'
        },
        {
            disease: 'Septicemia',
            value: 34003,
            color: '#507dca'
        }
    ];

    const svg = d3.select('#chart4').select('svg');
    // const svgContainer = d3.select('#chart2');

    const margin = 80;
    const width = 1000 - 2 * margin;
    const height = 500 - 2 * margin;

    const type = d3.annotationCalloutCircle

    const annotations = [{
        note: {
            // label: "Note how it compares to other deaths in 2005",
            bgPadding: 20,
            title: "Deaths in 1.5 yrs: Note how it compares to other deaths in 2005"
        },
        x: 200,
        y: 180,
        dy: -40,
        dx: 160,
        subject: {
            radius: 30,
            radiusPadding: 1
        }
    }]

    const chart = svg.append('g')
        .attr('transform', `translate(${margin}, ${margin})`)
        .attr('width',500)
        .attr('height',500);

    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(sample.map((s) => s.disease))
        .padding(0.4)

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 800000]);

    // vertical grid lines
    // const makeXLines = () => d3.axisBottom()
    //   .scale(xScale)

    const makeYLines = () => d3.axisLeft()
        .scale(yScale)

    chart.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale)).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-10)");

    chart.append('g')
        .call(d3.axisLeft(yScale)).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-20)");

    chart.append('g')
        .attr('class', 'grid')
        .call(makeYLines()
            .tickSize(-width, 0, 0)
            .tickFormat('')
        )

    const barGroups = chart.selectAll()
        .data(sample)
        .enter()
        .append('g')

    barGroups
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (g) => xScale(g.disease))
        .attr('y', (g) => yScale(g.value))
        .attr('height', (g) => height - yScale(g.value))
        .attr('width', xScale.bandwidth())
        .on('mouseenter', function (actual, i) {
            d3.selectAll('.value')
                .attr('opacity', 0)

            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 0.6)
                .attr('x', (a) => xScale(a.disease) - 5)
                .attr('width', xScale.bandwidth() + 10)

            const y = yScale(actual.value)

            line = chart.append('line')
                .attr('id', 'limit')
                .attr('x1', 0)
                .attr('y1', y)
                .attr('x2', width)
                .attr('y2', y)

            barGroups.append('text')
                .attr('class', 'divergence')
                .attr('x', (a) => xScale(a.disease) + xScale.bandwidth() / 2)
                .attr('y', (a) => yScale(a.value) + 30)
                .attr('fill', 'white')
                .attr('text-anchor', 'middle')
                .text((a, idx) => {
                    const divergence = (a.value - actual.value).toFixed(1)

                    let text = ''
                    if (divergence > 0) text += '+'
                    text += `${divergence}`

                    return idx !== i ? text : '';
                })

        })
        .on('mouseleave', function () {
            d3.selectAll('.value')
                .attr('opacity', 1)

            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 1)
                .attr('x', (a) => xScale(a.disease))
                .attr('width', xScale.bandwidth())

            chart.selectAll('#limit').remove()
            chart.selectAll('.divergence').remove()
        })

    barGroups
        .append('text')
        .attr('class', 'value')
        .attr('x', (a) => xScale(a.disease) + xScale.bandwidth() / 2)
        .attr('y', (a) => yScale(a.value)-10)
        .attr('text-anchor', 'middle')
        .text((a) => `${a.value}`)
        .style("fill", "white")

    svg
        .append('text')
        .attr('class', 'label')
        .attr('x', -(height / 2) - margin)
        .attr('y', margin / 6)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .style("fill", "red")
        .text('Number of Deaths')

    svg.append('text')
        .attr('class', 'label')
        .attr('x', width / 2 + margin)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'middle')
        .style("fill", "red")
        .text('Causes of death')

    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .text('Covid-19 & Other Leading Cause of Death')

    svg.append('text')
        .attr('class', 'source')
        .attr('x', width - margin / 2)
        .attr('y', height + margin * 1.7)
        .attr('text-anchor', 'start')

    const makeAnnotations = d3.annotation()
        .editMode(true)
        //also can set and override in the note.padding property
        //of the annotation object
        .notePadding(15)
        .type(type)
        //accessors & accessorsInverse not needed
        //if using x, y in annotations JSON
        .accessors({
            xScale: d => xScale(d.disease),
            yScale: d => yScale(d.value)
        })
        .accessorsInverse({
            disease: d => xScale.invert(d.xScale),
            value: d => yScale.invert(d.yScale)
        })
        .annotations(annotations)
    d3.select("svg")
        .append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)
}