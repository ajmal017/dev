

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
    geo_file: "usgeo.json"
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

var yById = d3.map(),
    nameById = d3.map(),
    path = d3.geo.path(),
    quants = d3.scale.quantile()
    tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(geo) {
            return nameById.get(geo.id) + 
            "<br/>" + config.id_col + ": " + yById.get(geo.id)
        });
    svg = d3.select(config.map_div).append("svg")
        .attr("width", "900")
        .attr("height", "600");
    
svg.call(tip);

function create_dataframe (d, id_col) {
    const dataframe = new Map(); // series = dataframe.get(var); value = series.get(id)
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
    return dataframe
}

Promise.all([
    fetch(config.data_file)
        .then(res => res.text())
        .then(res => Papa.parse(res, {header: true, dynamicTyping: true}))
        .then(papa => papa.data)
    ,fetch(config.geo_file)
        .then(res => res.json())
]).then(results => ready(results[0], results[1]))

function ready(data, geos){
    const dataframe = create_dataframe(data, config.id_col)
    yById = dataframe.get(config.y_col)
    const values = [...yById.values()]
    values.sort(function(a,b) {return a-b});
    quants
        .domain(values)
        .range(colorscale)

    draw_and_color (svg, geos, "counties", yById)
    draw_boundries (svg, geos, "states")
    draw_legend(values, config.legend_div);
}


function draw_and_color (svg, geos, geo_objects, yById) {
    svg.append("g")
        .attr("class", "border-and-fill")
        .selectAll("path")
        .data(topojson.feature(geos, geos.objects[geo_objects]).features)
        .enter()
        .append("path")
        .attr("id", function(geo) {return geo.id; })
        .attr("fill", function(geo) {return quants(yById.get(geo.id))}) //fill with mapped colors
        .attr("d", path)
        .on('mouseover',tip.show)
        .on('mouseout', tip.hide);    
}

function draw_boundries (svg, geos, geo_objects) {
    svg.append("g")
        .attr("class", "border")
        .selectAll("path")
        .data(topojson.feature(geos, geos.objects[geo_objects]).features)
        .enter()
        .append("path")
        .attr("d", path)
}

function draw_legend (values, legend_div) {
    bar_length = 40
    var legend = d3.select(legend_div)
        .append("svg")
        .attr("width", bar_length*colorscale.length)
        .attr("height", "20px")
        
    for (var i = 0; i < colorscale.length; i++) { //for each color 
        console.log(i)
        legend // add color bar
            .append("rect")
            .attr("x", bar_length*i)
            .attr("height", "10px")
            .attr("width", bar_length+"px")
            .attr("fill", colorscale[i])
        
        legend //add text
            .append("text")
            .attr("x", bar_length*i)
            .attr("font-size", "xx-small")
            .attr("fill", "white")
            .attr("y", 8)
            .text(d3.quantile(values, i/colorscale.length))
        
    };
}


/*

Various formatters.
var formatNumber = d3.format(",d"),
  formatChange = d3.format("+,d"),
  formatDate = d3.time.format("%B %d, %Y"),
  formatTime = d3.time.format("%I:%M %p");
// data across years
//var extant = [];                        



var nation = crossfilter(),
  all = nation.groupAll(),
  y_ = nation.dimension(function(d) { return d[id_col]; }),
  y_s = y_.group();



var charts = [
      
    barChart(true)
      .dimension(y_)
      .group(y_s)
    .x(d3.scale.linear()
      .domain([0.02, .2])
      .range([0, 900])),

    barChart(true)
      .dimension(per_cap)
      .group(per_caps)
    .x(d3.scale.linear()
      .domain([10000, 1000000])
      .range([0, 900]))
  ];

  var chart = d3.selectAll(".chart")
    .data(charts)
    .each(function(chart) { chart.on("brush", renderAll).on("brushend", renderAll); });

  renderAll();

  // barChart
  function barChart(percent) {
    if (!barChart.id) barChart.id = 0;

    percent = typeof percent !== 'undefined' ? percent : false;
    var formatAsPercentage = d3.format(".0%");
    
    var axis = d3.svg.axis().orient("bottom");
    if (percent == true) {
      axis.tickFormat(formatAsPercentage);
      
    }
    var margin = {top: 10, right: 10, bottom: 20, left: 10},
      x,
      y = d3.scale.linear().range([50, 0]),
      id = barChart.id++,
      brush = d3.svg.brush(),
      brushDirty,
      dimension,
      group,
      round;

    function chart(div) {
      var width = x.range()[1],
          height = y.range()[0];

      try {
        y.domain([0, group.top(1)[0].value]);
      }
      catch(err) {
        window.reset
      } 

      div.each(function() {
        var div = d3.select(this),
            g = div.select("g");

        // Create the skeletal chart.
        if (g.empty()) {
          div.select(".title").append("a")
              .attr("href", "javascript:reset(" + id + ")")
              .attr("class", "reset")
              .text("reset")
              .style("display", "none");

          g = div.append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          g.append("clipPath")
              .attr("id", "clip-" + id)
            .append("rect")
              .attr("width", width)
              .attr("height", height);

          g.selectAll(".bar")
              .data(["background", "foreground"])
            .enter().append("path")
              .attr("class", function(d) { return d + " bar"; })
              .datum(group.all());

          g.selectAll(".foreground.bar")
              .attr("clip-path", "url(#clip-" + id + ")");

          g.append("g")
              .attr("class", "axis")
              .attr("transform", "translate(0," + height + ")")
              .call(axis);

          // Initialize the brush component with pretty resize handles.
          var gBrush = g.append("g").attr("class", "brush").call(brush);
          gBrush.selectAll("rect").attr("height", height);
          gBrush.selectAll(".resize").append("path").attr("d", resizePath);
        }

        // Only redraw the brush if set externally.
        if (brushDirty) {
          brushDirty = false;
          g.selectAll(".brush").call(brush);
          div.select(".title a").style("display", brush.empty() ? "none" : null);
          if (brush.empty()) {
            g.selectAll("#clip-" + id + " rect")
                .attr("x", 0)
                .attr("width", width);
          } else {
            var extent = brush.extent();
            g.selectAll("#clip-" + id + " rect")
                .attr("x", x(extent[0]))
                .attr("width", x(extent[1]) - x(extent[0]));
          }
        }

        g.selectAll(".bar").attr("d", barPath);
      });

      function barPath(groups) {
        var path = [],
            i = -1,
            n = groups.length,
            d;
        while (++i < n) {
          d = groups[i];
          path.push("M", x(d.key), ",", height, "V", y(d.value), "h9V", height);
        }
        return path.join("");
      }

      function resizePath(d) {
        var e = +(d == "e"),
            x = e ? 1 : -1,
            y = height / 3;
        return "M" + (.5 * x) + "," + y
            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
            + "V" + (2 * y - 6)
            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
            + "Z"
            + "M" + (2.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8)
            + "M" + (4.5 * x) + "," + (y + 8)
            + "V" + (2 * y - 8);
      }
    }

    brush.on("brushstart.chart", function() {
      var div = d3.select(this.parentNode.parentNode.parentNode);
      div.select(".title a").style("display", null);
    });

    brush.on("brush.chart", function() {
      var g = d3.select(this.parentNode),
          extent = brush.extent();
      if (round) g.select(".brush")
          .call(brush.extent(extent = extent.map(round)))
        .selectAll(".resize")
          .style("display", null);
      g.select("#clip-" + id + " rect")
          .attr("x", x(extent[0]))
          .attr("width", x(extent[1]) - x(extent[0]));

      var selected = [];

      dimension.filterRange(extent).top(Infinity).forEach(function(d) {
        selected.push(d[config.id_col])
      });
      svg.attr("class", "counties")
        .selectAll("path")
          .attr("class", function(d) { if (selected.indexOf(d[config.id_col]) >= 0) {return "q8-9"} else if (extant.indexOf(d[config.id_col]) >= 0) {return "q5-9"} else {return null;}});

    });

    brush.on("brushend.chart", function() {
      if (brush.empty()) {
        var div = d3.select(this.parentNode.parentNode.parentNode);
        div.select(".title a").style("display", "none");
        div.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
        dimension.filterAll();
      }
    });

    chart.margin = function(_) {
      if (!arguments.length) return margin;
      margin = _;
      return chart;
    };

    chart.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      axis.scale(x);
      brush.x(x);
      return chart;
    };

    chart.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return chart;
    };

    chart.dimension = function(_) {
      if (!arguments.length) return dimension;
      dimension = _;
      return chart;
    };

    chart.filter = function(_) {
      if (_) {
        brush.extent(_);
        dimension.filterRange(_);
      } else {
        brush.clear();
        dimension.filterAll();
      }
      brushDirty = true;
      return chart;
    };

    chart.group = function(_) {
      if (!arguments.length) return group;
      group = _;
      return chart;
    };

    chart.round = function(_) {
      if (!arguments.length) return round;
      round = _;
      return chart;
    };

    return d3.rebind(chart, brush, "on");
  }

  // Renders the specified chart or list.
  function render(method) {
    d3.select(this).call(method);
  }

  // Whenever the brush moves, re-rendering everything.
  function renderAll() {
    chart.each(render);
  }

  window.reset = function(i) {
  window.filter = function(filters) {
    filters.forEach(function(d, i) { charts[i].filter(d); });
    renderAll();
  };

    charts.forEach(function (c) {
      c.filter(null);
    })
    renderAll();
    svg.attr("class", "counties")
      .selectAll("path")
        //.attr("class", function(d) { return quants(rateById.get(d[config.id_col])); });
  };
*/
