<script setup>
import { onBeforeMount, ref, watch, onMounted, useTemplateRef } from 'vue'
import * as d3 from 'd3'
import { useSharedZoomService } from '@/composables/SharedZoomService.js'
import { setHighlightedPeptideService } from '@/composables/HighlightedPeptide.js'

const { sharedZoom, finalDomain, finalDomainSetter, lastUpdater, updateZone } = useSharedZoomService()
const { setPeptide } = setHighlightedPeptideService()

const peptideCoverage = useTemplateRef('peptide-coverage')
const sequence = ref(null) // TODO move to protein store as sequence array
const peptidesFormatted = ref(null)
const peptideCoverageLine = ref(null)
let x, y,svg, xAxis, yAxis, zoom
const margin = { top: 0, right: 40, bottom: 80, left: 40 }
let svg_width=0, svg_height=0, chart_width=0, chart_height=0, moveXaxis=0
const props = defineProps({
  sequence: String,
  peptides: Array
})
// watch(
//     () => props.peptides,
//     () => {
//         console.log('peptides changed')
//         setSequence(props.sequence)
//         // addYcoordinateToPeptides()
//         setPeptidesArray()
//         setPepCoverage()
//         setPlotParams()
//         initPlot()
//     }
// )
watch(
    finalDomain,
    () => {
        //console.log('finalDomain changed')
        //console.log('lastUpdater',lastUpdater.value)
        if (lastUpdater.value !== peptideCoverage) {
            console.log('finalDomain', finalDomain)
            if (svg) {
                svg.transition().duration(100).call(zoom.transform, d3.zoomIdentity
                    .scale(chart_width / (x(finalDomain[1]) - x(finalDomain[0])))
                    .translate(-x(finalDomain[0]), 0))
            }
        }
    }
)
onBeforeMount(() => {
  setSequence(props.sequence)
  // addYcoordinateToPeptides()
  setPeptidesArray()
  setPepCoverage()
  
})
onMounted(() => {
  setPlotParams()
  initPlot()
})

const setPepCoverage = () => {
    // set array with number of elements equal to sequence length and set values to 0
    let pepCoverage = Array.apply(null,Array(props.sequence.length)).map(Number.prototype.valueOf, 0)
    props.peptides.forEach((pep, index) => {
        for(let i = pep.peptide_start -1; i <pep.peptide_end; i++){
            pepCoverage[i] = pepCoverage[i]+1
        }
    })
    peptideCoverageLine.value = pepCoverage
}
const isInRow = (peptideToAdd, peptidesRow) => {
    let inRow = false
    for(let i = 0; i < peptidesRow.length; i++){
        if(isInRange(peptideToAdd.peptide_start, peptideToAdd.peptide_end, peptidesRow[i].peptide_start, peptidesRow[i].peptide_end)){
            console.log('in row')
            inRow = true
            break
        }
    }
    return inRow
}

// is peptide in range
const isInRange = (start1, end1, start2, end2) => {
    if(end1 < start2){
        return false
    } else if(start1 > end2) {
        return false
    } else if(start1 == start2) {
        return true
    } else if(start1 >= start2 && start1 <= end2) {
        return true
    } else if(start1 >= start2 && end1 <= end2){
        return true
    } else if(end1 >= start2 && end1 <= end2) {
        return true
    } else if(start1 < start2 && end1 > end2) {
        return true
    }
}

const setPeptidesArray = () => {
    console.log('setPeptidesArray')
    const peptides = props.peptides
    let peptidesArray = []
    let peptidesArrayIndex = []
    peptides.forEach((peptideToAdd, index) => {
        if(peptidesArray.length == 0) {
            peptidesArray[0] = new Array(peptideToAdd)
            peptidesArrayIndex[0] = new Array(index)
            peptideToAdd['y'] = 0
        } else {
            // TODO possibly create a recursive function to replace this for loop
            for(let i = 0; i < peptidesArray.length; i++) {
                const inRow = isInRow(peptideToAdd, peptidesArray[i])
                if(inRow){
                    if(i == peptidesArray.length -1) {
                        peptidesArray[i+1] = new Array(peptideToAdd)
                        peptidesArrayIndex[i+1] = new Array(index)
                        peptideToAdd['y'] = i+1
                        break
                    } else {
                        continue
                    }
                } else {
                    peptidesArray[i].push(peptideToAdd)
                    peptidesArrayIndex[i].push(index)
                    peptideToAdd['y'] = i
                    break
                }
            }
        }
    })
    peptidesFormatted.value = peptides
}
const setSequence = () => {
    sequence.value = props.sequence.split('')
}
const setPlotParams = () => {
    svg_width = peptideCoverage.value.offsetWidth,
    svg_height = 250,
    chart_width = svg_width - margin.left - margin.right,
    chart_height = svg_height //- margin.top - margin.bottom,
    moveXaxis = 0;
}

const initPlot = () => {
    // minimum and maximum x axis values
    let xMax = sequence.value.length,
        xMin = 1;
    x = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, chart_width]).nice()
    y = d3.scaleLinear()
        .domain([0, Math.max.apply(Math, peptidesFormatted.value.map(o => o.y))])
        .range([chart_height - margin.bottom,margin.top])
    zoom = d3.zoom()
        .scaleExtent([1, 4/120*sequence.value.length]) //1,50
        .translateExtent([[0,0],[chart_width,chart_height]])
        .extent([[0,0],[chart_width,chart_height]])
        .on('zoom', zoomed)
        .on('end', (event) => {
            console.log('zoom end', event)
            const { sourceEvent } = event
            if(sourceEvent !== null) {
                finalDomainSetter()
            }
        });
    const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'peptide-coverage-tooltip')
        .style('visibility', 'hidden')
    svg = d3.select(peptideCoverage.value)
        .append('svg')
        .attr('width', svg_width)
        .attr('height', svg_height)
        .style("background-color", "white")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)
        //.call(zoom)
    xAxis = svg.append('g')
        .attr('transform', `translate(0, ${chart_height-20})`)
        .call(d3.axisBottom(x))
    // yAxis = svg.append('g')
    //     .attr('transform', `translate(${margin.left},0)`)
    //     .call(d3.axisLeft(y))
    const listenerRect = svg.append('rect')
        .attr('class','listener-rect')
        .attr('x', 0)
        .attr('y', -margin.top)
        .attr('width', chart_width)
        .attr('height', chart_height)
        .style('opacity', 0)
        .call(zoom)
    const peptidesGroup = svg.insert('g', '.listener-rect')
        .attr('class', 'peptides-group')
        .attr('transform', `translate(0, 50)`)
        // .attr('y', 0)
    const peptidesLines = peptidesGroup
        .selectAll('.peptide-line')
        .data(peptidesFormatted.value)
        .enter()
        .append('line')
        .attr('class', 'peptide-line')
        .attr('x1', d => x(d.peptide_start))
        .attr('x2', d => x(d.peptide_end))
        .attr('y1', d => y(d.y))
        .attr('y2', d => y(d.y))
        .attr('stroke', '#bfbfbf')
        .attr('stroke-width', 6)

    const modifsGroup = svg.insert('g', '.listener-rect')
        .attr('class','modifs-group')
        .attr('transform', `translate(0, 50)`)
    const modifsLines = modifsGroup
        .selectAll('.mod-line')
        .data(peptidesFormatted.value)
        .enter()
        .append('line')
        .attr('class', 'mod-line')
        .attr('x1', d => x(d.peptide_start + d.peptide_modification_position - 1))
        .attr('x2', d => x(d.peptide_start + d.peptide_modification_position))
        .attr('y1', d => y(d.y))
        .attr('y2', d => y(d.y))
        .attr('stroke', '#f43c09')
        .attr('stroke-width', 6)

    const transparentGroup = svg.append('g')
        .attr('class','transparent-group')
        .attr('transform', `translate(0, 50)`)
    const transparentLInes = transparentGroup
        .selectAll('.transparent-line')
        .data(peptidesFormatted.value)
        .enter()
        .append('line')
        .attr('class', 'transparent-line')
        .attr('x1', d => x(d.peptide_start))
        .attr('x2', d => x(d.peptide_end))
        .attr('y1', d => y(d.y))
        .attr('y2', d => y(d.y))
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 6)
        .style('opacity', 0)
        //.call(zoom)
        .on('click', (event, d) => {
            setPeptide(d)
            d3.select(event.currentTarget).style('fill', '#2A6A9E')
            tooltip.transition()
                .duration(200)
                .style('visibility', 'visible')
                .style('opacity', 0.9)
                .style('z-index', 2)
            tooltip
                .style('left', event.pageX + 'px')
                .style('top', event.pageY - 28 + 'px')
                .html('<div class="close-btn" onclick="closeTooltip()"> X </div>'+
                    '<p>Sequence: ' + d.peptide_sequence + '</p>'+
                    '<p>Modification position: ' + d.peptide_modification_position + '</p>' +
                    '<p>Modified residue: ' + d.peptide_sequence.substring(d.peptide_modification_position-1, d.peptide_modification_position) + '</p>' +
                    '<div>Start: ' + d.peptide_start + '</div>' +
                    '<div>End: ' + d.peptide_end + '</div>'
                )
        })
        // .on('mouseout', (event, d) => {
        //     console.log('mouseout')
        //     d3.select(event.currentTarget).style('fill', '#5E99C5');
        //     tooltip.transition()
        //         .duration(500)
        //         .style('visibilty', 'hidden')
        //         .style('opacity', 0)
        // })
    function closeTooltip() {
        console.log('close tooltip')
        tooltip.transition()
            .duration(500)
            .style('visibilty', 'hidden')
            .style('opacity', 0)
    }
}
const emits = defineEmits(['zoomed'])
const zoomed = (event) => {
    console.log('zoom peptideCoverage',event)
    const { transform, sourceEvent } = event
    console.log('peptideCoverage sourceEvent',sourceEvent)
    const newX = transform.rescaleX(x)

    xAxis.call(d3.axisBottom(newX))

    svg.selectAll('.peptide-line')
        .attr('x1', d => newX(d.peptide_start))
        .attr('x2', d => newX(d.peptide_end))

    svg.selectAll('.mod-line')
        .attr('x1', d => newX(d.peptide_start + d.peptide_modification_position - 1))
        .attr('x2', d => newX(d.peptide_start + d.peptide_modification_position))
    svg.selectAll('.transparent-line')
        .attr('x1', d => newX(d.peptide_start))
        .attr('x2', d => newX(d.peptide_end))
    svg.select('.x-axis-sequence')
        .attr("x", (d, i) => newX(i+1))
    if(sourceEvent !== null) {
        updateZone(newX.domain(), peptideCoverage)
        // finalDomainSetter()
        emits('zoomed', event)
    }
    
}
</script>
<template lang="pug">
    div
        div(
          id="peptide-coverage"
          ref="peptide-coverage"
          class="peptide-coverage"
        )
</template>
<style lang="scss">
.peptide-coverage{
  width: 900px;
  z-index: 0;
  position: relative;
}
.bar{
    background-color: #5E99C5;
}
.peptide-coverage-tooltip{
    z-index: 1;
    position: absolute;
    text-align: left;
    color: black;
    width: auto;
    height: auto;
    padding: 2px;
    font-size: 12px;
    background-color: rgb(191, 202, 241);
    border: 1px solid black;
    border-radius: 3px;
    pointer-events: none;
    // padding: 10px;
    // border-radius: 5px;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
    .close-btn{
        position: absolute;
        top: 5px;
        right: 10px;
        cursor: pointer;
    }
}
</style>

