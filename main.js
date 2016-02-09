var data_url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

d3.json(data_url, function(err, jsonData) {
  if (err) throw err;

  console.log(jsonData[0]['Time'], jsonData[30]['Place']);

  // Setup
  var w = 800;
  var h = 800;
  
  // SVG
  var svg = d3.select('body')
    .append('svg')
    .attr({
      width: w,
      height: h
    });

  // Dots
  var dots = svg.selectAll('circle')
    .data(jsonData)
    .enter()
    .append('circle')
    .attr({
      cx: function(d) {
        return d['Time'].replace(':', '.');
      },
      cy: function(d) {
        return d['Place'];
      },
      r: 3,
      'fill': 'red'
    });
  
  // Create Scale

  // Create Axis

  // Add Axis


});