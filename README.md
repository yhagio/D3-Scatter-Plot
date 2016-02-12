### Scatter Plot Graph using D3

# [DEMO](http://yhagio.github.io/D3-Scatter-Plot/)

![Screenshot](/SCR.png)

### Resources
- [D3:Time Scales](https://github.com/mbostock/d3/wiki/Time-Scales)
- [Stackoverflow - Remove end-ticks from D3.js axis](http://stackoverflow.com/questions/13669239/remove-end-ticks-from-d3-js-axis)
- [Duration Histogram - Time format on axis](http://bl.ocks.org/mbostock/3048166)
- [Stackoverflow - D3.js time scale: nicely-spaced ticks at minute intervals when data is in seconds?](http://stackoverflow.com/questions/24541296/d3-js-time-scale-nicely-spaced-ticks-at-minute-intervals-when-data-is-in-second)

Notes:
I try to display each racer's name next to each dot. But it only displays the names of the racers ranking 14 - 35, and not displaying people who are ranking 1 - 13. I found that
I forgot to group the elements, so
```js
// From
  svg.selectAll('text')
    .data(jsonData)
    .enter()
    .append('text')
    ...
// To this
  svg.append('g')
    .selectAll('text')
    .data(jsonData)
    .enter()
    .append('text')
    ...
```
