console.log('hola');

let distr = [0.1, 0.2, 0.3, 0.5, 0.7, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]

dGraph('#distrg');

function dGraph(idsvg){
    const marginX = 50;
    const marginY = 50;
    let todo = d3.select(idsvg).append('g').attr('id','todo').attr('transform','translate('+marginX+','+marginY+')');

    const el   = document.getElementById(idsvg.substr(1));
    const rect = el.getBoundingClientRect();

    const Gwidth = rect.width - 2*marginX;
    const Gheight = rect.height - 2*marginY;

    var inicioX  = new Date();
    inicioX.setHours(7);
    inicioX.setMinutes(0);
    inicioX.setMilliseconds(0);

    var finX  = new Date();
    finX.setHours(23);
    finX.setMinutes(0);
    finX.setMilliseconds(0);

    let miEscalaX = d3.scaleTime().domain([inicioX,finX]).range([0, Gwidth]);

    let miEscalaY = d3.scaleLinear().domain([0,1]).range([Gheight, 0]);

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
        .ticks(1)
        .tickFormat(function(d, i) {
            if (i==0){
                return 'min'
            }
            else if (i==1){
                return 'max'
            }
            else
                return ''
        });
        // .tickFormat(d3.format(format))

    todo.append("g") //es parte de un grupo
        .attr("id", "yMiEje")
        .call(yMiEje);

    var valorX  = new Date();
    valorX.setHours(8);
    valorX.setMinutes(0);
    valorX.setMilliseconds(0);

    todo.append("path")
        .attr('id','distr_curve')
        .datum(distr)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 4)
        .attr("d", d3.line()
            .x(function(d,i) { return miEscalaX(valorX.setHours(8 + i)) })
            .y(function(d) { return miEscalaY(d) })
        )

    let circulos = todo.append('g').attr('id','circulos');
    for (let i=0; i<=14; i++) {
        valorX.setHours(8 + i);
        circulos.append('circle')
            .attr('id','c'+((i<10)?'0'+i:i))
            .attr('r', 5)
            .attr('cx', miEscalaX(valorX))
            .attr('cy', miEscalaY(distr[i]))
            .attr('fill', 'white')
            .on("mouseover", function (d) {d3.select(this).style("cursor", "pointer");})
            .on("mouseout", function (d) {})
            .call(d3.drag()
                .on("drag", dragged)
            );
    }

    function dragged(d) {
        let objy = miEscalaY.invert(event.y - d.y + miEscalaY(d.y));
        objy = Math.round(objy*1000)/1000;
        if (miEscalaY.invert(objy)>1){
            objy = miEscalaY(1);
        }
        else if (miEscalaY.invert(objy)<0){
            objy = miEscalaY(0);
        }
        let fv = Math.round(miEscalaY.invert(objy)*100)/100;
        distr[parseInt(this.id.slice(-2))] = fv;
        console.log(distr);
        // d3.select(this).attr("cy", d.y = miEscalaY(fv)); //discreto
        d3.select(this).attr("cy", d.y = objy); //smooth
        d3.select('#distr_curve').attr("d", d3.line()
            .x(function(d,i) { return miEscalaX(valorX.setHours(8 + i)) })
            .y(function(d) { return miEscalaY(d) })
        )
    }
}





