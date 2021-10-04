
let data;

d3.csv('data.csv').then(d => data = d)
    .then( function (){
        barPlot('#gsim1', 'E_NQ');
        piePlot('#gsim2', '10');
        barPlot('#gsim3', 'E_WQ');
        barPlot('#gsim4', 'N_cte');
        barPlot('#ginf1', 'E_NQ');
        piePlot('#ginf2', '10');
        barPlot('#ginf3', 'E_WQ');
        barPlot('#ginf4', 'N_cte');
    });


function barPlot(idsvg, columna){
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

    // todo.append("g") //es parte de un grupo
    //     .attr("id", "xMiEje")
    //     .attr("transform", "translate(0," + Gheight + ")")
    //     .call(xMiEje)
    // .selectAll('text')
    // .attr("y", 0)
    // .attr("x", 9)
    // .attr("dy", ".35em")
    // .attr("transform", "rotate(90)")
    // .style("text-anchor", "start");

    todo.append("g") //es parte de un grupo
        .attr("id", "xMiEje")
        .attr('class','axis')
        .attr("transform", "translate(0," + Gheight + ")")
        .call(xMiEje)
        .selectAll('text')
        .style('font-size',Math.min(Gheight/10,14))
        .style('font-family', 'roboto')
        .attr("y", 10)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start");

    let yMiEje = d3.axisLeft()
        .scale(miEscalaY)
    // .tickFormat(d3.format(format))

    todo.append("g") //es parte de un grupo
        .attr("id", "yMiEje")
        .call(yMiEje)
        .selectAll('text')
        .style('font-size',Math.min(Gheight/10,14))
        .style('font-family', 'roboto');



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
        .attr('fill','#69b3a2')
        .attr('onmouseover',(d,i) => "showNumber(this,'num_tag"+i+idsvg.substr(1)+"')")
        .attr('onmouseout',(d,i) => "unshowNumber(this,'num_tag"+i+idsvg.substr(1)+"')")

    bars.selectAll('text')
        .data(data).enter()
        .append('text')
        .attr('id',(d,i) => 'num_tag'+i+idsvg.substr(1))
        .attr('class','num_tag')
        .attr('x',d => miEscalaX(valorX.setHours(d.hora))-Gwidth/32 + Gwidth/32)
        .attr('y',d => miEscalaY(d[columna])-10)
        .attr('fill','white')
        .style('text-anchor', 'middle')
        .style('font-size', Math.min(Gheight/10,14))
        .style('font-weight','bold')
        .style('display','none')
        .text(d => Math.round(d[columna]*100)/100 )

}

function piePlot(idsvg,hora){
    let svg = d3.select(idsvg);
    svg.html("");

    const colores = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']

    var el   = document.getElementById(idsvg.substr(1)); // or other selector like querySelector()
    var rect = el.getBoundingClientRect();

    let lado = (rect.width>rect.height)?rect.height:rect.width;
    console.log(data);

    data_g = data.filter(d => d.hora == hora);

    new_data = [];

    for (let i = 0; i<5; i++){
        if(i==4)
            new_data.push(data_g[0]['PI_4m']);
        else
            new_data.push(data_g[0]['PI_'+i]);
    }


    let pieChart = d3.pie().sort(function(d,i) { return i; });

    pData = pieChart(new_data);

    d3.select(idsvg).append('g').attr('id','todo'+idsvg);

    d3.select(idsvg)
        .append("g")
        .attr("transform", "translate("+lado/2+","+lado/2+")")
        .selectAll("path")
        .data(pData).enter()
        .append("path")
        .attr("d", d3.arc()
            .outerRadius((lado/2)-2)
            .innerRadius(lado/3)
        )
        .attr("onmouseover",(d,i) => "highlightPie(this,"+i+",'"+hora+"')")
        .attr("onmouseout",(d,i) => "unhighlightPie(this,"+i+",'"+hora+"')")
        .style("fill", function (d, i) {
            return colores[i];
        });
        // .style("stroke", "white")
        // .style("stroke-width", "2px");



    const labels = ["Fila Vacia","1 persona","2 personas","3 personas","4 o mas"];
    let legend = d3.select(idsvg).append("g").attr("class","leyenda").attr("id","legend");
    for (i in labels){
        legend.append('rect').attr('y',i*lado/10).attr('height',lado/20).attr('width',lado/20).style('fill',colores[i]).text(labels[i]);
        legend.append('text').attr('x',lado/19).attr('y',i*lado/10+lado/20-2).style('fill','white').style('font-size',lado/20).text(labels[i]);
    }
    console.log(lado)
    legend.attr('transform','translate('+lado*1.1+','+lado/20+')')

    for (i in new_data){
        let gtext = d3.select(idsvg).append("g").attr("class","textos"+hora).attr("id","t"+i+hora);
        if (i!=0)
            gtext.style("display","none");

        let texto = d3.format(",.3p")(new_data[i]);

        gtext.append("text")
            .attr("x",lado*0.5)
            .attr("y",lado*0.45)
            .style("font-size",lado*0.1)
            .style('font-family', 'roboto')
            .style("fill","white")
            .style("text-anchor", "middle")
            .style("dominant-baseline", "central")
            .style("letter-spacing", "-.03em")
            .text(texto);

        gtext.append("text")
            .attr("x",lado*0.5)
            .attr("y",lado*0.6)
            .style("font-size",lado*0.1)
            .style('font-family', 'roboto')
            .style("fill","white")
            .style("text-anchor", "middle")
            .style("letter-spacing", "-.03em")
            .text(labels[i]);
    }

}

function highlightPie(elem,i,hora){
    d3.select(elem).style("fill","#1bf2dd");
    d3.selectAll(".textos"+hora).style("display","none");
    d3.select("#t"+i+hora).style("display","block");
}

function unhighlightPie(elem,i,hora){
    const colores = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
    d3.select(elem).style("fill",colores[i]);
    d3.selectAll(".textos"+hora).style("display","none");
    d3.select("#t0"+hora).style("display","block");
}

function changePie(elem){
    piePlot('#gsim2', elem.value);
}

function showNumber(elem,id){
    d3.select(elem).attr('fill','#bcbd22');
    console.log('#'+id)
    d3.select('#'+id).style('display','block');
}

function unshowNumber(elem,id){
    d3.select(elem).attr('fill','#69b3a2');
    d3.select('#'+id).style('display','none');
}