sap.ui.define([
    "sap/ui/core/Control",
	"CriptAnaliser/model/formatter"
    
], function (Control, formatter) {
	"use strict";
	return Control.extend("CriptAnaliser.controls.MinMax", {
		metadata : {
            properties : {                
                minima: {type : "float", defaultValue:0.0},
                maxima: {type : "float", defaultValue:0.0},
                day : {type : "string"},
                coin : {type : "string"},
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

        },

		renderer : function (oRM, oControl) {
            oRM.write("<div ");
            oRM.writeControlData(oControl);
            oRM.write(">");
            let min = oControl.getMinima();
            let max = oControl.getMaxima();  
            let diff = max - min;
            let day = formatter.getDDMM(oControl.getDay());
            //let day =oControl.getDay()
            let coin = oControl.getCoin();
            const createObjectNumber = function(state, value){
                let oNumber = new sap.m.ObjectNumber({
                    state: state,
                    number:formatter.currency(value)                                
                });
    
                return oNumber;
            }
            let labeltring =  `${coin} - ${day}`;
            let top = createObjectNumber("Success", max);
            let middle = createObjectNumber("Warning", min);
            let bottom = createObjectNumber("None", diff);

            let label = new sap.m.Label({text : labeltring});
            oRM.renderControl(label)
            oRM.renderControl(top);
            oRM.renderControl(middle);
            oRM.renderControl(bottom);
			oRM.write("</div>");
        },

        

	});
});
