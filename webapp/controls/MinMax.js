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
                current: {type : "float", defaultValue:0.0},
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
            let percentBase = min;
            let percentVariation = (100 / percentBase) * diff;
            percentVariation = percentVariation.toFixed(2);

            //let day = oControl.getDay()
            let current = oControl.getCurrent();
            let coin = oControl.getCoin();
            const createObjectNumber = function(state, value, percent){
                let oNumber = new sap.m.ObjectNumber({
                    state: state,
                    number:formatter.currency(value),
                    unit : percent                                
                });
    
                return oNumber;
            }
            let labeltring =  `${coin} - ${day}`;
            let top = createObjectNumber("Success", max, "Max");
            top.setTooltip("Máxima");
            let middle = createObjectNumber("Error", min, 'Min');
            middle.setTooltip("Mínima");
            let percentTExt = `(${percentVariation}%)`
            let bottom = createObjectNumber("Warning", diff, percentTExt);
            bottom.setTooltip("Variação entre Mínima e Máxima")
            let label = new sap.m.Label({text : labeltring});
            oRM.renderControl(label)
            oRM.renderControl(top);
            oRM.renderControl(middle);
            oRM.renderControl(bottom);
            if(current){
                let footer = createObjectNumber("None", current);
                footer.setTooltip("Preço Atual");
                oRM.renderControl(footer);
            }
			oRM.write("</div>");
        },

        

	});
});
