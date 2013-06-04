var margin = {top: 10, right: 10, bottom: 20, left: 40},
  width = 760 - margin.left - margin.right,
  height = 780 - margin.top - margin.bottom;




var vis = d3.select("body").append("svg:svg")
  .attr("class", "chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("svg:g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");


d3.csv("data/2012facultymajor.csv",  function(d) {
  return {
    dept: d.Department,
    faculty: +d.Faculty,
    students: +d.Students,
    year: +d.Year
  };
}, function(error, rows) {

    rows.forEach(function(d) {
      d.ratio = d.faculty / d.students;
      d.stuff = ["students", "faculty", "ratio"].map(function(name){ return {name: name, value: +d[name]}; });
    });

    rows.sort( function(a, b) {
        if (a.ratio < b.ratio) {
          return -1;
        } else if (a.ratio == b.ratio) {
          return 0;
        } else {
          return 1;
        }
    });

    var x = d3.scale.linear()
      .domain([0, d3.max(rows, function(d){ return d.students; })])
      .range([0, width/2]);

    var xpercent = d3.scale.linear()
      .domain([0, d3.max(rows, function(d){ return d.ratio; })])
      .range([width / 2, 0]);

    var y0 = d3.scale.ordinal()
      .domain(d3.range(rows.length))
      .rangeBands([0, height], 0.2)

    var y1 = d3.scale.ordinal()
      .domain(d3.range(rows.length))
      .range([0, y0.rangeBand()]);

    vis.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate("+ width/2+"," + height + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"));

    vis.append("g")
      .attr("class", "xpercent axis")
      .attr("transform", "translate(0," + margin.top + ")")
      .call(d3.svg.axis().scale(xpercent).orient("top"));


    var departments = vis.selectAll("g.department")
      .data(rows)
    .enter().append("svg:g")
      .attr("class","department")
      .attr("transform", function(d,i) { return "translate(0," + (20 + i * 26) + ")"});

    departments.selectAll("rect")
      .data(function(d){return d.stuff;})
    .enter().append("rect")
      .attr("x", function(d) {
         if (d.name == "ratio")
           return xpercent(d.value);
        return width/2;})

      .attr("y", function(d, i){
        if (d.name == "ratio")
          return 0;
        return i * 11;
      })
      .attr("width", function(d) {
          if (d.name == "ratio")
            return width/2 - xpercent(d.value);
          return x(d.value);
        })
      .attr("height", 10)
      .style("fill",function(d) {
        if (d.name == "ratio")
            return "orange";
        return "steelblue";
        })


    departments.append("text")
      .attr("x", width/2)
      .attr("y", 0)

      .style("text-anchor","end")
      .text(function(d){return d.dept;});

}
);

