console.log('chao');

let data;

d3.csv('data.csv').then(d => data = d)
    .then( function (){
        console.log(data);
        barPlot('#gsim1', 'E_NQ');
        barPlot('#gsim2', 'E_WQ');
        barPlot('#gsim4', 'E_WQ');
        barPlot('#ginf1', 'E_NQ');
        barPlot('#ginf2', 'E_WQ');
    });


function barPlot(idsvg, columna){
    const marginX = 50;
    const marginY = 50;
    let todo = d3.select(idsvg).append('g').attr('id','todo').attr('transform','translate('+marginX+','+marginY+')');

    const el   = document.getElementById(idsvg.substr(1));
    const rect = el.getBoundingClientRect();

    console.log(rect)

    const Gwidth = rect.width - 2*marginX;
    const Gheight = rect.height - 2*marginY;

    var inicioX  = new Date();
    inicioX.setHours(7);
    inicioX.setMinutes(0);
    inicioX.setMilliseconds(0);

    var finX  = new Date();
    finX.setHours(24);
    finX.setMinutes(0);
    finX.setMilliseconds(0);

    let miEscalaX = d3.scaleTime().domain([inicioX,finX]).range([0, Gwidth]);

    const maxD = d3.max(data, function (d) {
        return +d[columna]
    });

    let miEscalaY = d3.scaleLinear().domain([0,maxD]).range([Gheight, 0]);

    let xMiEje = d3.axisBottom()
        .scale(miEscalaX)
        .tickFormat(d3.timeFormat("%I %p"));

    todo.append("g") //es parte de un grupo
        .attr("id", "xMiEje")
        .attr("transform", "translate(0," + Gheight + ")")
        .call(xMiEje)
    // .selectAll('text')
    // .attr("y", 0)
    // .attr("x", 9)
    // .attr("dy", ".35em")
    // .attr("transform", "rotate(90)")
    // .style("text-anchor", "start");

    let yMiEje = d3.axisLeft()
        .scale(miEscalaY)
    // .tickFormat(d3.format(format))

    todo.append("g") //es parte de un grupo
        .attr("id", "yMiEje")
        .call(yMiEje);

    var valorX  = new Date();
    valorX.setHours(8);
    valorX.setMinutes(0);
    valorX.setMilliseconds(0);

    let bars = todo.append('g').attr('id','bars');

    bars.selectAll('rect')
        .data(data).enter()
        .append('rect')
        .attr('x',d => miEscalaX(valorX.setHours(d.hora))-Gwidth/32  )
        .attr('y',d => miEscalaY(d[columna]))
        .attr('height',d => miEscalaY(0) - miEscalaY(d[columna]))
        .attr('width',Gwidth/18)
        .attr('rx',2)
        .attr('fill','white');

}