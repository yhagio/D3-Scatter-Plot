var data_url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

d3.json(data_url, function(err, jsonData) {
  if (err) throw err;

  // Setup
  var margin = {
    top: 50,
    right: 80,
    bottom: 40,
    left: 40
  };

  var w = 800 - margin.right - margin.left;
  var h = 600 - margin.top - margin.bottom;

  var lastPlace = jsonData[jsonData.length-1]['Place'];
  var topTime = jsonData[0]['Seconds'];
  var lastTime = jsonData[jsonData.length-1]['Seconds'];

  // Formatters for counts and times (converting numbers to Dates).
  var formatTime = d3.time.format("%H:%M");
  var formatMMSS = function(d) { 
    var newTime = new Date(2016, 0, 1, 0, d); // Y, M, D, H, M
    newTime.setSeconds(newTime.getSeconds() + d);
    return formatTime(newTime);
  };


  // SVG
  var svg = d3.select('body')
    .append('svg')
    .attr({
      width: w + margin.right + margin.left,
      height: h + margin.top + margin.bottom
    });



  // Create X-Scale
  // Domain: Largest difference from top + 30s to 0 (Top)
  var xScale = d3.scale.linear() // Time from top
    .domain([lastTime - topTime + 30, 0])
    .range([0, w]);

  // Create X-axis
  var xAxisCreate = d3.svg.axis()
    .scale(xScale)
    .ticks(6)
    .orient('bottom')
    .tickFormat(formatMMSS);

  // Add X-axis
  var xAxis = svg.append('g') // grouping like div tag
    .call(xAxisCreate)
    .attr({
      'class': 'axis',
      'transform': 'translate('+margin.left+', '+h+')'
    });
  
  // Add X-axis lable text
  xAxis.append('text')
    .attr({
      x: w / 2 + 70,
      y: 25,
      dy: '1em'
    })
    .style('text-anchor', 'end')
    .text('Minutes Behind Fastest Time');


  // Create Y-Scale
  var yScale = d3.scale.linear() // Ranking
  .domain([lastPlace + 5, 0])
  .range([h,0]);

  // Create Y-axis
  var yAxisCreate = d3.svg.axis()
    .scale(yScale)
    .orient('left');

  // Add Y-axis
  var yAxis = svg.append('g') // grouping like div tag
    .call(yAxisCreate)
    .attr({
      'class': 'axis',
      'transform': 'translate('+margin.left+', 0)'
    });

  // Remove the bottom edge tick from y-axis
  d3.select(yAxis.selectAll('.tick')[0][0]).remove();
  
  // Remove the top edge tick from y-axis
  d3.select(yAxis.selectAll('.tick')[0][yAxis.selectAll('.tick')[0].length-1]).remove();

  // Add Y-axis label text
  yAxis.append('text')
    .attr({
      transform: 'rotate(-90)',
      x: -10,
      y: -40,
      dy: '1em'
    })
    .style('text-anchor', 'end')
    .text('Ranking');

  // === Dots ===
  svg.selectAll('circle')
    .data(jsonData)
    .enter()
    .append('circle') // Create new circle
    .attr({
      cx: function(d) { // Translate x coordinate
        return xScale(d['Seconds'] - topTime);
      },
      cy: function(d) { // Translate y coordinate
        return yScale(d['Place']);
      },
      r: 5, // Radius of the dot
      'fill': function(d) { // Dot color
        return dopingDotColor(d['Doping'])
      }
    })
    // Creating tooltp on mouseover event
    .on('mouseover', function(d) {

      //Circle dot animation
      d3.select(this)
        .transition()
        .ease('elastic')
        .duration(1000)
        .attr('r', 7);
      
      // Tooltip animation
      d3.select('#tooltip')
        .style("left", 250 + "px")
        .style("top", 150 + "px")
        .select("#value")
          .html(
            '<strong>'+d['Name']+'</strong>'+
            '<p><span>Year '+d['Year']+' / Time '+d['Time']+'</span></p><br/>'+
            '<p>'+dopingText(d['Doping'])+'</p>');

      //Show the tooltip
      d3.select('#tooltip')
        .transition()
        .ease('quad')
        .duration(500)
        .style("opacity", 1);

    })
    .on('mouseout', function(d) {
      // Hide the tooltip on mouseout
      d3.select(this)
        .transition()
        .ease('elastic')
        .duration(1000)
        .attr('r', 5);

      d3.select('#tooltip')
        .transition()
        .ease('quad')
        .duration(500)
        .style("opacity", 0);
    });
  
  // === Add racer names next to each dot ===
  svg.append('g')
    .selectAll('text')
    .data(jsonData)
    .enter()
    .append('text')
    .text(function(d) {
      return d['Name'];
    })
    .attr({
      x: function(d) {
        return xScale(d['Seconds'] - topTime);
      },
      y: function(d) {
        return yScale(d['Place']);
      },
      'font-size': '0.6em',
      'transform': 'translate(7, 4)'
    });

  // === Doping: Dot & Description Label ===
  svg.append('circle')
    .attr({
      cx: w-212,
      cy: h-165,
      r: 5,
      'fill': 'red'
    });

  d3.select('#doping')
    .style("left", w + "px")
    .style("top", (h-100) + "px")
    .html('<p>Riders with doping allegations</p>');
  
  // === Non-Doping: Dot & Description Label ===
  svg.append('circle')
    .attr({
      cx: w-212,
      cy: h-145,
      r: 5,
      'fill': 'green'
    });

  d3.select('#nodoping')
    .style("left", w + "px")
    .style("top", (h-80) + "px")
    .html('<p>No doping allegations</p>');

});

function dopingDotColor(doping) {
  return doping ? 'red': 'green';
}

function dopingText(text) {
  return text ? text : 'No Doping';
}

