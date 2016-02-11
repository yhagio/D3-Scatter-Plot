var data_url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

d3.json(data_url, function(err, jsonData) {
  if (err) throw err;

  // Setup
  var margin = {
    top: 40,
    right: 80,
    bottom: 40,
    left: 40
  };

  var w = 700 - margin.right - margin.left;
  var h = 500 - margin.top - margin.bottom;

  var lastPlace = jsonData[jsonData.length-1]['Place'];
  var topTime = jsonData[0]['Seconds'];
  var lastTime = jsonData[jsonData.length-1]['Seconds'];

  // Formatters for counts and times (converting numbers to Dates).
  var formatTime = d3.time.format("%M:%S");
  var formatMMSS = function(d) { 
    
    var newTime = new Date(2012, 0, 1, 0, d); // Y, M, D, H, M
    // console.log(newTime.getSeconds() + d);
    newTime.setSeconds(newTime.getSeconds() + d);
    console.log(newTime);
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
    .ticks(5)
    .orient('bottom')
    .tickFormat(formatMMSS);

  // Add X-axis
  var xAxis = svg.append('g') // grouping like div tag
    .call(xAxisCreate)
    .attr({
      'class': 'axis',
      'transform': 'translate('+margin.left+', '+(h-margin.top)+')'
    });
    
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


  // Create Y-Scale
  var yScale = d3.scale.linear() // Ranking
  .domain([lastPlace + 5, 1])
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
      'transform': 'translate('+margin.right+', 0)'
    });

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





  // === Dots ===
  // svg.selectAll('circle')
  //   .data(jsonData)
  //   .enter()
  //   .append('circle')
  //   .attr({
  //     cx: function(d) {
  //       var sec = topTime - d['Seconds'];
  //       return (w-margin.right) - ( (w-margin.right) * sec / (60*3 + 30) );
  //       // return xScale(sec);
  //     },
  //     cy: function(d) {
  //       // return y(d['place']);
  //       return ((d['Place'] * h ) / 40);
  //     },
  //     r: 4,
  //     'fill': 'red'
  //   });
  
  // === Add racer names next to each dot ===
  // svg.selectAll('text')
  //   .data(jsonData)
  //   .enter()
  //   .append('text')
  //   .attr({
  //     x: function(d) {
  //       var sec = diffTimeWithTop(d['Seconds'], topTime);
        
  //       return (w-margin.right) - ((w-margin.right) * sec / 210);
  //     },
  //     y: function(d) {
  //       return ((d['Place'] * h ) / 40) + 6;
  //     },
  //     'font-size': '0.7em'
  //   })
  //   .text(function(d) {
  //     return d['Name'];
  //   });


});

