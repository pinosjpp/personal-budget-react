import React, { useEffect } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

function D3Chart() {
  
    const dataSource = {
        datasets: [
            {
                data: [],
                backgroundColor: [
                    '#ffcd56',
                    '#ff6384',
                    '#36a2eb',
                    '#fd6b19',
                    '#a05d56',
                    '#d0743c',
                    '#ff8c00'
                ],
            }
        ],
        labels: []
    };

    useEffect(() => {
        axios.get('http://localhost:3000/budget').then((res) => {
            console.log(res);
            for(var i = 0; i < res.data.myBudget.length; i++) {
                dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
                dataSource.labels[i] = res.data.myBudget[i].title;
            }
        });
        
        function inputData (dataSource) {
            var labels = color.domain();
            var i = 0;
            return labels.map(function(label) {
                return { label: label, value: dataSource.datasets[0].data[i++] }
            });
        }
        
        var color = d3.scaleOrdinal().domain(dataSource.labels).range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
        
        const svg = d3.select("body").append("svg").append("g");

        svg.append("g").attr("class", "slices");
        svg.append("g").attr("class", "labels");
        svg.append("g").attr("class", "lines");

        const width = 960, height = 450, radius = Math.min(width, height) / 2;

        const pie = d3.pie().sort(null).value(function(d) {
            return d.value;
        });

        var arcTest = d3.svg.arc().outerRadius(radius * 0.8).innerRadius(radius * 0.4);

        const outerArc = d3.svg.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9);

        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        const key = function(d){ return d.data.label; };

        change(inputData());

        function change(data) {
            const slice = svg.select(".slices").selectAll("path.slice").data(pie(data), key);

            slice.enter()
                .insert("path")
                .style("fill", function(d) { return color(d.data.label); })
                .attr("class", "slice");
        
            slice.transition().duration(1000)
                .attrTween("d", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        return arcTest(interpolate(t));
                    };
                })
        
            slice.exit().remove();

            const text = svg.select(".labels").selectAll("text").data(pie(data), key);
        
            text.enter().append("text").attr("dy", ".35em")
                .text(function(d) {
                    return d.data.label;
                });
            
            function midAngle(d){
                return d.startAngle + (d.endAngle - d.startAngle)/2;
            }
        
            text.transition().duration(1000)
                .attrTween("transform", function(d) {
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                        return "translate("+ pos +")";
                    };
                })
                .styleTween("text-anchor", function(d){
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        return midAngle(d2) < Math.PI ? "start":"end";
                    };
                });
        
            text.exit().remove();

            const polyline = svg.select(".lines").selectAll("polyline").data(pie(data), key);
            
            polyline.enter().append("polyline");
        
            polyline.transition().duration(1000)
                .attrTween("points", function(d){
                    this._current = this._current || d;
                    var interpolate = d3.interpolate(this._current, d);
                    this._current = interpolate(0);
                    return function(t) {
                        var d2 = interpolate(t);
                        var pos = outerArc.centroid(d2);
                        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                        return [arcTest.centroid(d2), outerArc.centroid(d2), pos];
                    };			
                });
            
            polyline.exit().remove();
        }
    })



    return (
        <div>
            
        </div>
    );
}

export default D3Chart;