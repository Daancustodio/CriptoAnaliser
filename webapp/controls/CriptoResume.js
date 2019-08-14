sap.ui.define([
    "sap/ui/core/Control",
	"CriptAnaliser/model/formatter"
    
], function (Control, formatter) {
	"use strict";
	return Control.extend("CriptAnaliser.controls.CriptoResume", {
		metadata : {
            properties : {                
                minima: {type : "float", defaultValue:0.0},
                maxima: {type : "float", defaultValue:0.0},
                current: {type : "float", defaultValue:0.0},
                open: {type : "float", defaultValue:0.0},
                close: {type : "float", defaultValue:0.0},
                volume: {type : "float", defaultValue:0.0},                
                day : {type : "string"},
                coin : {type : "string"},
                width: {type: "sap.ui.core.CSSSize",defaultValue: "100%"},                
                height: {type: "sap.ui.core.CSSSize",defaultValue: "auto"}
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
            let open = oControl.getOpen();  
            let close = oControl.getClose();  
            let volume = oControl.getVolume();
            let diff = max - min;
            let day = formatter.getDDMM(oControl.getDay());
            let percentBase = min;
            let percentVariation = (100 / percentBase) * diff;
            percentVariation = percentVariation.toFixed(2);
            let current = oControl.getCurrent();
            let coin = oControl.getCoin();

            let labeltring =  `${day}`;

            const createObjectNumber = function(state, value, percent){
                let oNumber = new sap.m.ObjectNumber({
                    state: state,
                    number:formatter.currencyNoSymbol(value),       
                    unit: percent,
                    textAlign: "Center"                                        
                });
    
                return oNumber;
            }
    

            
            let oMaxima = createObjectNumber("Success", max, "");
            oMaxima.setTooltip("Máxima");

            let oMinima = createObjectNumber("Error", min,'');
            oMinima.setTooltip("Mínima");
           
            let oOpen = createObjectNumber("None", open, 'Abertura');
            oOpen.setTooltip("Abertura");
           
            let oClose = createObjectNumber("None", close, 'Fechamento');
            oClose.setTooltip("Fechamento");
            
            let percentTExt = `(${percentVariation}%)`
            let oMinMaxVariation = createObjectNumber("Warning", diff, percentTExt);
            oMinMaxVariation.setTooltip("Variação entre Mínima e Máxima")
            
            let oVol = createObjectNumber("None", volume);
            oVol.setTooltip("Volume Negociado");
            

            let labelCoinAndDate = new sap.m.Label({text : labeltring});

            let hbox = new sap.m.HBox({justifyContent:"SpaceAround"})
            let vboxStart = new sap.m.VBox({justifyContent:"SpaceAround"})
            let vboxMiddle = new sap.m.VBox({ alignItems:"Center"})
            let vboxEnd = new sap.m.VBox({justifyContent:"SpaceAround"})

            vboxMiddle.addItem(labelCoinAndDate)

            vboxStart.addItem(oOpen)
            vboxMiddle.addItem(oMaxima)
            vboxMiddle.addItem(oVol)
            vboxMiddle.addItem(oMinima)
            vboxEnd.addItem(oClose);

            hbox.addItem(vboxStart)
            hbox.addItem(vboxMiddle)
            hbox.addItem(vboxEnd)

            oRM.renderControl(hbox);

			oRM.write("</div>");
        },

       
	});
});
