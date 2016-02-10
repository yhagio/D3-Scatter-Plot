var data_url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

d3.json(data_url, function(err, jsonData) {
  if (err) throw err;

  // Setup
  var margin = {top: 40, right: 80};
  var w = 700 + margin.right;
  var h = 500 + margin.top;
  var lastPlace = jsonData[jsonData.length-1]['Place'];
  var topTime = jsonData[0]['Time'];
  var lastTime = jsonData[jsonData.length-1]['Time'];
  
  // SVG
  var svg = d3.select('body')
    .append('svg')
    .attr({
      width: w,
      height: h
    });

  // Dots
  var dotsNode = svg.selectAll('g')
    .data(jsonData)
    .enter()
    .append('g');

  dotsNode.append('circle')
    .attr({
      cx: function(d) {
        var sec = diffTopTimeAndThisTime(d['Time'], topTime);

        return (w-margin.right) - ( (w-margin.right) * sec / (60*3 + 30) );
        // return w+40 - ((w * d['Time'].slice(0,2)) / 40);
      },
      cy: function(d) {
        return ((d['Place'] * h ) / 40);
      },
      r: 4,
      'fill': 'red'
    });
  
  // Add racer names next to each dot
  dotsNode.append('text')
    .attr({
      x: function(d) {
        var sec = diffTopTimeAndThisTime(d['Time'], topTime);
        
        return (w-margin.right) - ((w-margin.right) * sec / 210);
      },
      y: function(d) {
        return ((d['Place'] * h ) / 40) + 6;
      },
      'font-size': '0.7em'
    })
    .text(function(d) {
      return d['Name'];
    });


  
  // Create Scale
  var top = timeInputToMilliseconds(topTime);
  var last = timeInputToMilliseconds(lastTime);


  var xScale = d3.time.scale() // Time from top
    .domain([lastToTop(last + 30000, top), -30000]) // Difference of Last Time & Top Time to 0
    .range([0, w]);

  var yScale = d3.scale.linear() // Ranking
    .domain([lastPlace + 5, 1])
    .range([h,0]);

  // Create X-axis
  var xAxisCreate = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickFormat(d3.time.format('%M:%S'))
    .ticks(d3.time.second, 30);

  // Add X-axis
  var xAxis = svg.append('g') // grouping like div tag
    .call(xAxisCreate)
    .attr('class', 'axis')
    .attr('transform', 'translate(40, '+(h-margin.top)+')');
    
  // Remove the left edge tick from x-axis (3:30)
  d3.select(xAxis.selectAll('.tick')[0][xAxis.selectAll('.tick')[0].length-1]).remove();
  
  // Add X-axis lable text
  xAxis.append('text')
    .attr({
      x: w / 2 + 70,
      y: 25,
      dy: '1em'
    })
    .style('text-anchor', 'end')
    .text('Minutes Behind Fastest Time');



  // Create Y-axis
  var yAxisCreate = d3.svg.axis()
    .scale(yScale)
    .orient('left');

  // Add Y-axis
  var yAxis = svg.append('g') // grouping like div tag
    .call(yAxisCreate)
    .attr('class', 'axis')
    .attr('transform', 'translate('+margin.right+', 0)');

  // Remove the bottom edge tick from y-axis (40)
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

});

// Convert time input "MM:SS" format to milliseconds
function timeInputToMilliseconds(time) {
  var splitedArray = time.split(':');
  var minutes = parseInt(splitedArray[0]);
  var seconds = parseInt(splitedArray[1]);

  var minutesToSeconds = minutes * 60;

  return (minutesToSeconds + seconds) * 1000;
}

// Calculate the difference, in milliseconds, 
// of top lap and the last lap
function lastToTop(last, top) {
  return parseInt(last) - parseInt(top);
}


// Calculate seconds of the difference
// between top and the target time
function diffTopTimeAndThisTime(targettime, toptime) {
  return (timeInputToMilliseconds(targettime) - timeInputToMilliseconds(toptime)) / 1000;
}
