
const config = {
    data_file: "latest housing valuation.csv",
    id_col: 'FIPS',
    name_col: 'County',
    y_col: 'Net Annual Return',
    quant: 'scaleQuantile',
    colors: ['blue', "red"],
    color_number: 7,
    legend_div: "#map-legend",
    map_div: "#map",
    data_type: "",
    geo_file: "usgeo.json",
}
config.data_type = config.data_type || config.data_file.split('.').pop();

/*
var color = d3
    .scale
    .linear()
    .domain([-1,-2,-3])
    .range(config.colors)
colorscale = []
for (i=-1; i <= config.colors.length; i=i-1/(config.color_number-1)) {
    colorscale.push(color(i))
}
*/
colorscale = ['rgb(155,0,0)', 'rgb(255,0, 0)', 'rgb(255,0, 155)', 'rgb(155,0, 255)', 'rgb(0,0, 255)', 'rgb(0,0, 155)']//, 'rgb(0, 0, 255)']

var 
    geos = {} // I could not figure out how to make it const

const 
    path = d3.geo.path()
    , dataframe = new Map() // series = dataframe.get(var); value = series.get(id)
    , quants = d3.scale.quantile()
    , svg = d3.select(config.map_div).append("svg")
        .attr('viewBox','0 0 900 600')
        .attr('preserveAspectRatio','xMinYMin')
    , tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(geo) {
            return dataframe.get(config.name_col).get(geo.id) + 
            "<br/>" + config.id_col + ": " + dataframe.get(config.y_col).get(geo.id)
        });

svg.call(tip);

function create_dataframe (d, id_col) {
    vars = Object.keys(d[0])
    vars.splice(vars.indexOf(id_col), 1)
    for (v of vars) {
        dataframe.set(v, new Map())
    }

    for (row of d) {
        key = row[id_col]
        for (v of vars) {
            series = dataframe.get(v)
            value = row[v]
            series.set(key, value)
        }
    }
}

Promise.all([
    fetch(config.data_file)
        .then(res => res.text())
        .then(res => Papa.parse(res, {header: true, dynamicTyping: true}))
        .then(papa => papa.data)
        .then(data => create_dataframe(data, config.id_col))
    ,fetch(config.geo_file)
        .then(res => res.json())
]).then(results => ready(results[1]))

function ready(geos){
    const values = [...dataframe.get(config.y_col).values()]
    values.sort(function(a,b) {return a-b});
    quants
        .domain(values)
        .range(colorscale)
    counties_geos = topojson.feature(geos, geos.objects['counties']).features
    states_geos = topojson.feature(geos, geos.objects['states']).features
    draw_and_color (svg, counties_geos, dataframe.get(config.y_col))
    draw_boundries (svg, states_geos)
    draw_legend(config.legend_div, values);
}


function draw_and_color (svg, geo_data, yById) {
    svg.append("g")
        .attr("class", "border-and-fill")
        .selectAll("path")
        .data(geo_data)
        .enter()
        .append("path")
        .attr("id", function(geo) {return geo.id; })
        .attr("fill", function(geo) {return quants(yById.get(geo.id))}) //fill with mapped colors
        .attr("d", path)
        .on('mouseover',tip.show)
        .on('mouseout', tip.hide);    
}

function draw_boundries (svg, geo_data, geo_objects) {
    svg.append("g")
        .attr("class", "border")
        .selectAll("path")
        .data(geo_data)
        .enter()
        .append("path")
        .attr("d", path)
}

function draw_legend (legend_div, values) {
    bar_length = 40;
    var legend = d3.select(legend_div)
        .append("svg")
        //.attr("width", bar_length*colorscale.length)
        //.attr("height", "2em")
        
    for (var i = 0; i < colorscale.length; i++) { //for each color 
        legend // add color bar
            .append("rect")
            .attr("style", "display: block;")
            //.attr("x", bar_length*i)
            .attr("height", "1em")
            .attr("width", bar_length+"px")
            .attr("fill", colorscale[i])
        /*
        legend //add text
            .append("text")
            .attr("x", bar_length*i)
            .attr("font-size", "small")
            .attr("fill", "white")
            .attr("y", "1em")
            .text(d3.quantile(values, i/colorscale.length))
        */
    };
}

