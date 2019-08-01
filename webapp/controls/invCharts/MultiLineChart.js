sap.ui.define([
    "sap/ui/core/Control",
	"CriptAnaliser/model/formatter"
    
], function (Control, formatter) {
	"use strict";
	return Control.extend("CriptAnaliser.controls.invCharts.MultiLineChart", {
		metadata : {
            properties : {                
                title: {type : "string", defaultValue: ""},                                  
                values: {type : "array", defaultValue:[]},  
                labels: {type : "array", defaultValue:[]},  
                labelY: {type : "string", defaultValue: "Valores"},  
                labelX: {type : "string", defaultValue: "Meses"},
                displayTitle: {type : "boolean", defaultValue:true},  
                tooltipMode: {type : "string", defaultValue: "index"},  
                tooltipIntersect: {type : "boolean", defaultValue: false},                                
                hoverIntersect: {type : "boolean", defaultValue: true},      
                hoverMode: {type : "string", defaultValue: "nearest"},  
                displayLabelX: {type : "boolean", defaultValue: true},      
                displayLabelY: {type : "boolean", defaultValue: true},  
                chartType: {type: "string", defaultValue:"line"},
                width: {
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "100%"
                },                
                height: {
                    type: "sap.ui.core.CSSSize",
                    defaultValue: "auto"
                }
            }           
        },        
		init : function () {
            $.sap.includeStyleSheet("webapp/controls/invCharts/chartjs/dist/Chart.css");
            $.sap.require("CriptAnaliser/controls/invCharts/chartjs/dist/Chart");
        },

		renderer : function (oRm, oControl) {
            oRm.write("<canvas") 
            oRm.addStyle("width", oControl.getProperty('width'));
            oRm.addStyle("height", oControl.getProperty('height'));                      
            oRm.writeClasses();
            oRm.writeControlData(oControl);
            oRm.writeStyles();
            oRm.write(">");
            oRm.write("</canvas>");
        },
        activate: function(dataSets, labels) {
            var canvas = document.querySelector("canvas");
            try {
                    const config = this.getChartConfig(dataSets, labels);
                    this.multiLineChart = new Chart(canvas, config);                    
            } catch (e) {
                console.error(e);
            }
        },
        getChartConfig(dataSets, labels){   
                    
		    let config = {
                type: this.getChartType(),
                data: {
                    labels: labels,
                    datasets: dataSets
                },
                options: {
                    responsive: true,
                    title: {
                        display: this.getDisplayTitle(),
                        text: this.getTitle()
                    },
                    tooltips: {
                        mode: this.getTooltipMode(),
                        intersect: this.getTooltipIntersect(),
                    },
                    hover: {
                        mode: this.getHoverMode(),
                        intersect: this.getHoverIntersect()
                    },
                    scales: {
                        xAxes: [{
                            display: this.getDisplayLabelX(),
                            scaleLabel: {
                                display: this.getDisplayLabelY(),
                                labelString: this.getLabelX()
                            }
                        }],
                        yAxes: [{
                            display: this.getDisplayLabelY(),
                            scaleLabel: {
                                display: this.getDisplayLabelY(),
                                labelString: this.getLabelY()
                            }
                        }]
                    }
                }
            };
        
            return config;
        }
	});
});
