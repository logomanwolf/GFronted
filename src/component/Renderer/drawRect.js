import * as d3 from "d3"

var drawRect = function (transform) {
        console.log(transform)
        
        let svg=d3.select("#minimap-wrapper").select("svg")

        var svgWidth = document.getElementById("contour-svg").width.baseVal.value
        var svgHeight = document.getElementById("contour-svg").height.baseVal.value
        var canvasWidth = d3.select("canvas").attr('width')
        var canvasHeight = d3.select("canvas").attr('height')
        
        let rect=svg.select("rect")
        rect.remove()
        svg.append("rect")
            .attr('x',-transform.x*svgWidth/(canvasWidth*transform.k))
            .attr('y',-transform.y*svgHeight/(canvasHeight*transform.k))
            .attr('width',svgWidth/transform.k)
            .attr('height',svgHeight/transform.k)
            .attr('stroke','#999')
            .attr('stroke-width',2)
            .attr('fill-opacity',0)
}

export default drawRect