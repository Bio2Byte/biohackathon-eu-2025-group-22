<script setup>
import { onBeforeMount, ref, watchEffect, watch, onMounted, useTemplateRef } from 'vue'
import * as d3 from 'd3'
import { useSharedZoomService } from '@/composables/SharedZoomService.js'

const { sharedZoom, finalDomain, finalDomainSetter, lastUpdater, updateZone } = useSharedZoomService()

const sequenceBlock = useTemplateRef('sequence-block')
const props = defineProps({
    sequence: String
})
let xScale = '';
let xAxis ='';
let zoom = '';
let svgSeq = "";
const margin = { top: 0, right: 40, bottom: 80, left: 40 }
let svg_width=0, svg_height=0, chart_width=0, chart_height=0, moveXaxis=0
let proteinseq = ''

watch(
    finalDomain,
    () => {
        if (lastUpdater.value !== sequenceBlock) {
            if (svgSeq) {
                svgSeq.transition().duration(100).call(zoom.transform, d3.zoomIdentity
                    .scale(chart_width / (xScale(finalDomain[1]) - xScale(finalDomain[0])))
                    .translate(-xScale(finalDomain[0]), 0))
            }
        }
    }
)

onMounted (() => {
    setPlotParams()
    initSequence()
    // console.log(proteinStore.bioProperties)
})



const setPlotParams = () => {
    svg_width = sequenceBlock.value.offsetWidth
    svg_height = 100
    chart_width = svg_width - margin.left - margin.right,
    chart_height = svg_height - margin.top - margin.bottom,
    moveXaxis = 0;
}

const initSequence = () => {
    setPlotParams()
    console.log(props.sequence)
    const xMax = props.sequence.length,
        xMin = 1;
    xScale = d3.scaleLinear()
        .range([0, chart_width]).nice()
        .domain([xMin, xMax]);

    xAxis = d3.axisBottom(xScale);
    zoom = d3.zoom()
        .scaleExtent([1, 4/120*props.sequence.length]) //1,50
        .translateExtent([[0,0],[chart_width,chart_height]])
        .on('zoom', zoomed)
        .on('end', (event) => {
            console.log('sequence zoom end', event)
            const { sourceEvent } = event
            if(sourceEvent!==null) {
                finalDomainSetter()
            }
        })
    console.log(sequenceBlock.value)
    svgSeq = d3.select(sequenceBlock.value)
        .append('svg')
        .attr('width', svg_width)
        .attr('height', svg_height)
        .style('background-color', 'white')
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        
    const listenerRect = svgSeq
        .append("rect")
        .attr('class', 'listerner-rect-sequence')
        .attr("x", 0)
        .attr("y", 30)
        .attr("width", chart_width)
        .attr("height", chart_height)
        .style("fill", "white")
        .call(zoom)
    svgSeq.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0,' + (chart_height + moveXaxis) + ')')
        .call(xAxis);

    proteinseq = svgSeq.append('g')
        .selectAll("text")
        .attr("class", "sequence")
        .data(props.sequence)
        .enter()
        .append("text")
        .attr("y", chart_height-2)
        .text(d => d)
        .attr("x", (d,i) => xScale(i+1))
        .style("font-size", "13px")
        .style("x", "5")
        .attr("text-anchor", "middle")
        .attr("visibility", "hidden")
}

const emits = defineEmits(['zoomed'])
const zoomed = (event) => {
    console.log('zoomed sequence')
    const { transform ,sourceEvent } = event
    // create new scale ojects based on event
    const new_xScale = transform.rescaleX(xScale)
    // update axes
    svgSeq.select('.x-axis').call(xAxis.scale(new_xScale))
    proteinseq.attr('x', (d, i) => new_xScale(i+1))
    if (new_xScale.domain()[1] - new_xScale.domain()[0] >= 60) {
        proteinseq.attr("visibility", "hidden")
    } else {
        proteinseq.attr("visibility", "visible")
    }
    if(sourceEvent !== null) {
        updateZone(new_xScale.domain(), sequenceBlock)
        // finalDomainSetter()
        emits('zoomed', event)
    }
    
}
</script>
<template lang="pug">
    div.fv-sequence
        div(ref="sequence-block")

</template>
<style lang="scss">
.fv-sequence {
    width: 900px;
}
p.sequence {
    word-wrap: break-word;
}

</style>
