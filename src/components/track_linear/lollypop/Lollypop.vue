<script setup>
import { onBeforeMount, ref, watchEffect, watch, onMounted, useTemplateRef } from 'vue'
import * as d3 from 'd3'

const modificationsOnStructure = ref(null)
const proteinBlock = useTemplateRef('protein-block')
const props = defineProps({
  sequence: String,
  modifications: Array,
  selectedStructure: Object
})

let seqarray = [];
let pdbId = '';
const modifications = ref([]);
let xScale = "";
let xAxis ="";
let zoom = "";
let svg = "";
let svg2 ="";
let ptmLines = "";
let ptmsites = "";
let proteinseq ="";
let maxPeptideCount = 0;
const margin = { top: 0, right: 40, bottom: 80, left: 40 }
let svg_width=0, svg_height=0, chart_width=0, chart_height=0, moveXaxis=0

onMounted(() => {
    console.log('onMounted')
    // convertProteinSequenceIntoArray(props.sequence)
    // createPtmMapping()
    console.log(props)
    clearPlot()
    setProteinSequenceAndPSites(props.sequence)
    createProteinView(props.sequence)
})
function setProteinSequenceAndPSites(sequence, pSites, pdbId){
    seqarray = sequence.split("");
    modificationsOnStructure.value = props.selectedStructure.modifications
    // modificationsOnStructure.value = modifications.filter(function(obj) {
    //     return pdbId in obj.pdbIds;
    // });
    // for (let i = 0; i < modifications.length; i++) {
    //     if(modifications[i].peptides.length > maxPeptideCount){
    //         maxPeptideCount = modifications[i].peptides.length;
    //     }
    // }
   
}
const clearPlot = () => {
    console.log('clearPlot')
    if(svg != ''){
        d3.selectAll(".protein_sequence g > *").remove()
        d3.select(".protein_sequence svg").remove()
    }
}
const setPlotParams = () => {
    svg_width = proteinBlock.value.offsetWidth,
    svg_height = 300,
    chart_width = svg_width - margin.left - margin.right,
    chart_height = svg_height - margin.top - margin.bottom,
    moveXaxis = 0;
}
function createProteinView(sequence){
    console.log('createProteinView')
    setPlotParams()

    let xMax = sequence.length,
        xMin = 1;

    xScale = d3.scaleLinear()
        .range([0, chart_width]).nice()
        .domain([xMin, xMax]);

    xAxis = d3.axisBottom(xScale);
    let tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip_protein_sequence')
        .style('visibility', 'hidden')

    zoom = d3.zoom()
        .scaleExtent([1, 4/120*sequence.length]) //1,50
        .translateExtent([[0,0],[chart_width,chart_height]])
        .on("zoom", zoomed);

    svg = d3.select("#protein-block")
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height)
        .style("background-color", "white")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg2 = svg
        .append("svg")
        .attr("width", chart_width)
        .attr("height", chart_height)
        .append("g")
        .call(zoom)

    let view = svg2
        .append("rect")
        .attr("width", chart_width)
        .attr("height", chart_height)
        .style("fill", "white");

    let gX = svg
        .append("g")
        .classed("xAxis", true)
        .attr("transform", "translate(0," + (chart_height + moveXaxis) + ")")
        .call(xAxis);


    let xAxisLabel = svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", chart_width/2)
        .attr("y", chart_height + 30)
        .text("Protein Sequence")
        .style("font-size", "13px")
        .style("font-family", "Arial");

    ptmLines = svg2.append("g")
        .attr("id", "lines")
        .selectAll(".line")
        .data(props.modifications)
        .enter()
        .append("line")
        .classed("line", true)
        .attr("stroke-width", 1)
        .attr("stroke", "#666666")
        .attr("x1", d => xScale(d.uniprot_position))
        .attr("y1", chart_height - 5)
        .attr("x2", d => xScale(d.uniprot_position))
        .attr("y2", d => 100);

    ptmsites = svg2.append("g")
        .attr("id", "circles")
        .selectAll("circle")
        .data(props.modifications)
        .enter()
        .append("circle")
        .attr("r", 8)
        .attr("cx", d => xScale(d.uniprot_position))
        .attr('cy', d => 100 )
        .style("fill", d => {
            setGrad(d)
            return "url(#grad" + props.modifications.indexOf(d) +")"
        })
        .on("mouseover", function(event, d){
            d3.select(this).attr("r", 16);
            // tip.show(d);
            tooltip.transition()
                .duration(200)
                .style('visibility', 'visible')
                .style('opacity', 0.9)
            tooltip
                .style('left', event.pageX+'px')
                .style('top', (event.pageY-28)+'px')
                // .style('background-color', 'blue')
                .html('<p>Tooltip</p>'+
                    '<p>Residue:' + d.modified_residue+'</p>'+
                    '<p># projects: N/A</p>'+
                    '<p># peptides: N/A</p>'+
                    '<p>P-site on structure: '+ (d.pdb_position ? d.pdb_position : '-') + '</p>'+
                    '<p>P-site in sequence:'+ d.uniprot_position+'</p>'+
                    '<p># phosphorylated: N/A</p>'+
                    '<p># unphosphorylated: N/A</p>'+
                    '<p>Mutation: N/A</p>'
                )
            // if(modificationsOnStructure.value !== null){
            //     if(modificationsOnStructure.value.some(function(item){
            //         return hasValue(item, 'uniprot_position', d.uniprot_position)})) {
            //             console.log('colorSelectedPart call in structure')
            //         // colorSelectedPart(d, 'blue');
            //     } 
            // }
            // TODO: color structure with the rest of the modifications
            // else {
            //     colorSelectedPart(d, 'brown')
            // }
        })
        .on("mouseout", function(d) {
            d3.select(this).attr("r", 8);
            tooltip.transition()
                .duration(500)
                .style('visibilty', 'hidden')
                .style('opacity', 0)
        })
        .style("stroke", function(d){
            if(props.selectedStructure.pdb_id === 'AlphaFold'){
                return "#074ae8"; // blue
            } else {
                if(modificationsOnStructure.value !== null){
                    if(modificationsOnStructure.value.some(function(item){
                        // console.log(item)
                        return hasValue(item, 'uniprot_position', d.uniprot_position)
                    })) {
                        return "#074ae8"; // blue
                    } else {
                        return "#7B241C"; // brown
                    }
                }
            }})
        .style("stroke-width","2");

    proteinseq = svg2.append("g")
        .selectAll("text")
        .data(seqarray)
        .enter()
        .append("text")
        .attr("y", chart_height-2)
        .text(d => d)
        .attr("x", (d,i) => xScale(i+1))
        .style("font-size", "13px")
        .style("x", "5")
        .attr("text-anchor", "middle")
        .attr("visibility", "hidden");
    createCompass()
    setLegend()
}

    // **************************************** add navigation compass ****************************************************
const createCompass = () => {
    svg.append("circle")
        .attr("cx", chart_width - 64)
        .attr("cy", 15)
        .attr("r",10)
        .style("fill", "white")
        .style("stroke","#666666").style("stroke-width","1")
        .on("mouseover", function(){
            d3.select(this).style("fill", "#bdbdbd");
        })
        .on("mouseout", function() {
            d3.select(this).style("fill", "white");
        })
        .on("click", applyReset);

    svg.append("circle")
        .attr("class","designInButton")
        .attr("cx", chart_width - 64)
        .attr("cy", 15)
        .attr("r",3)
        .style("fill", "none")
        .style("stroke","#666666").style("stroke-width","2");

    svg.append("circle")
        .attr("cx", chart_width - 42)
        .attr("cy", 15)
        .attr("r",10)
        .style("fill", "white")
        .style("stroke","#666666").style("stroke-width","1")
        .on("mouseover", function(){
            d3.select(this).style("fill", "#bdbdbd");
        })
        .on("mouseout", function() {
            d3.select(this).style("fill", "white");
        })
        .on("click", zoomINbuttonAction);

    svg.append("line")
        .attr("class","designInButton")
        .attr("stroke-width", 2)
        .attr("stroke", "#666666")
        .attr("x1", chart_width - 46).attr("y1", 15).attr("x2", chart_width - 38).attr("y2", 15);

    svg.append("line")
        .attr("class","designInButton")
        .attr("stroke-width", 2)
        .attr("stroke", "#666666")
        .attr("x1", chart_width-42).attr("y1", 11).attr("x2", chart_width-42).attr("y2", 19);

    svg.append("circle")
        .attr("cx", chart_width - 86)
        .attr("cy", 15)
        .attr("r",10)
        .style("fill", "white")
        .style("stroke","#666666").style("stroke-width","1")
        .on("mouseover", function(){
            d3.select(this).style("fill", "#bdbdbd")
        })
        .on("mouseout", function() {
            d3.select(this).style("fill", "white")
        })
        .on("click", zoomOUTbuttonAction)

    svg.append("line")
        .attr("class","designInButton")
        .attr("stroke-width", 2)
        .attr("stroke", "#666666")
        .attr("x1", chart_width - 90).attr("y1", 15).attr("x2", chart_width - 82).attr("y2", 15)

    let panLeftx = chart_width - 118
    svg.append("path")
        .attr("d", "M" + panLeftx + " 14 l20 -12 a100,40 0 0,0 0,24z")
        .style("fill","white")
        .style("stroke","#666666").style("stroke-width","1")
        .on("mouseover", function(){
            d3.select(this).style("fill", "#bdbdbd")
        })
        .on("mouseout", function() {
            d3.select(this).style("fill", "white")
        })
        .on("click", panLeftbuttonAction);

    let panRightx = chart_width - 10; ///2 + 54;
    svg.append("path")
        .attr("d", "M" + panRightx + " 14 l-20 -12 a100,40 0 0,1 0,24z")
        .style("fill","white")
        .style("stroke","#666666").style("stroke-width","1")
        .on("mouseover", function(){
            d3.select(this).style("fill", "#bdbdbd")
        })
        .on("mouseout", function() {
            d3.select(this).style("fill", "white")
        })
        .on("click", panRightbuttonAction);

}

// ************************ Functions ***********************************

const setLegend = () => {
    const color = d3.scaleSequential([0, 5], d3.schemeBlues[6])
    const colorScale = d3.scaleLinear()
  	    .domain([0,	1,	2,	3, 4, 5])
  	    .range(['#E28672', '#EC93AB', '#CEB1DE', '#95D3F0', '#77EDD9', '#A9FCAA']);

    const xScale = d3.scaleBand()
        .domain([0, 5])
        .range([0, 5])
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, 1])
    const svgLegend = svg2
        .append('svg')
        .attr('width', 300)
        // .attr('height', 20)
    const defs = svgLegend.append('defs')

    const linearGradient = defs.append('linearGradient')
        .attr('id', 'linear-gradient')
        .attr("x1", '0%')
        .attr("y1", '0%')
        .attr("x2", '100%')
        .attr("y2", '0%')
    linearGradient.selectAll('stop')
        // .data([
        //     {offset: "0%", color: "#E28672"},
        //     {offset: "10%", color: "#EC93AB"},
        //     {offset: "15%", color: "#CEB1DE"},
        //     {offset: "20%", color: "#95D3F0"},
        //     {offset: "25%", color: "#77EDD9"},
        //     {offset: "100%", color: "#A9FCAA"}
        // ])
        .data(d3.ticks(0, 5, 6))
        .enter().append("stop")
        .attr('offset', d => d)
        .attr('stop-color', color.interpolator())

    svgLegend.append("rect")
        .attr("x", 10)
        .attr("y", 30)
        .attr("width", 300)
        .attr("height", 15)
        .style("fill", "url(#linear-gradient)");
    const xLeg = d3.scaleLinear()
        .domain([0, 5])
        .range([0,5]);

    const axisLeg = d3.axisBottom(xLeg)
        .tickValues(colorScale.domain())

    svgLegend
        .attr("class", "axis")
        .append("g")
        .attr("transform", "translate(0, 50)")
        .call(axisLeg)
        // .data(d3.ticks(0, 1, 2, 3, 4, 5))
        // .enter()
        // .append('stop')
        // .attr('offset', d => d)
        // .attr('stop-color', color.interpolator())
    
    // svg2.append("linearGradient")
    //     //.attr("id", gradient.id)
    //     .attr("gradientUnits", "userSpaceOnUse")
    //     .attr("x1", 10)
    //     .attr("y1", 100)
    //     .attr("x2", 10)
    //     .attr("y2", 110)
    //     .selectAll("stop")
    //     .data(d3.ticks(0, 1, 10))
    //     .join("stop")
    //     //.attr("offset", d => d)
    //     .attr("stop-color", color.interpolator());
    
    // const legendInStructure = d3.Legend(d3.scaleQuantize([1, 10], d3.schemeBlues[9]), {
    //     title: "In current structure"
    // })
    // svg2.append(legendInStructure).attr('x1', '0%').attr('x2', '0%').attr('y1', '90%').attr('y2','0%')
    // d3.Legend(d3.scaleQuantize([1, 10], d3.schemeOrRd[9]), {
    //     title: "Not in current structure)"
    // })
}
function setGrad(d) {
    // console.log('setGrad', d)
    let colorSize = 0;
    if(maxPeptideCount > 0) {
        colorSize = (d.peptides.length * 100) / maxPeptideCount;
    }

    let grad = svg2.append("defs").append("linearGradient").attr("id", "grad" + props.modifications.indexOf(d))
        .attr("x1", "0%").attr("x2", "0%").attr("y1", "100%").attr("y2", "0%");
    if(props.selectedStructure.pdb_id === 'AlphaFold'){
        grad.append("stop").attr("offset", "0%").style("stop-color", "#074ae8");
    } else{
        if(modificationsOnStructure.value.some(function(item){return hasValue(item, 'uniprot_position', d.uniprot_position)})) {
            grad.append("stop").attr("offset", colorSize + "%").style("stop-color", "#074ae8");
        } else {
            grad.append("stop").attr("offset", colorSize + "%").style("stop-color", "#7B241C");
        }
        grad.append("stop").attr("offset", colorSize + "%").style("stop-color", "white");
        if(colorSize == 100){
            grad.append("stop").attr("offset", colorSize + "%").style("stop-color", "white");
        }else{
            grad.append("stop").attr("offset", 100 + "%").style("stop-color", "white");
        }
    }
}

function hasValue(obj, key, value) {
    return obj.hasOwnProperty(key) && obj[key] === value;
}

function applyReset() {
    svg2.transition()
        .duration(2000)
        .call(zoom.transform, d3.zoomIdentity);
}

function zoomINbuttonAction(){
    svg2.transition()
        .duration(200)
        .call(zoom.scaleBy, 1.5);
    //zoom.scaleBy(svg2, 1.5);
}

function zoomOUTbuttonAction(){
    svg2.transition()
        .duration(200)
        .call(zoom.scaleBy, 0.66);
    //zoom.scaleBy(svg2, 0.66);
}

function panLeftbuttonAction(){
    svg2.transition()
        .duration(500)
        .call(zoom.translateBy, 10 * 1200/sequence.value.length, 0);
}

function panRightbuttonAction(){
    svg2.transition()
        .duration(500)
        .call(zoom.translateBy, -10 * 1200/sequence.value.length, 0);
    // zoom.translateBy(svg2, -10, 0);
}

function zoomed(event) {
    svg.select(".xAxis").call(xAxis.scale(event.transform.rescaleX(xScale)));
    let new_xScale = event.transform.rescaleX(xScale);
    ptmsites.attr("cx", function(d) { 
        // console.log(d)
        return new_xScale(d.uniprot_position);
    });
    ptmLines
        .attr("x1", function(d) {
            return new_xScale(d.uniprot_position)
        })
        .attr("x2", function(d) { return new_xScale(d.uniprot_position) })
    proteinseq.attr("x", function(d, i) { return new_xScale(i+1) })
    if (new_xScale.domain()[1] - new_xScale.domain()[0] >=60) {
        proteinseq.attr("visibility", "hidden")
    } else {
        proteinseq.attr("visibility", "visible")
    }
}



</script>

<template>
    <div>
        <div id="protein-block" ref="protein-block" class="protein_block" style="width: 800px"></div>
    </div>
</template>

<style>
.protein_block {
    width: auto;
    height: 300px;
}
</style>

