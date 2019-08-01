sap.ui.define([
    "CriptAnaliser/src/app/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
    "CriptAnaliser/model/formatter",
    'sap/ui/model/Filter',
    "sap/ui/model/resource/ResourceModel"
],

function (BaseController, JSONModel, Device, MessageToast, MessageBox, BusyIndicator, formatter, Filter,ResourceModel) {
    "use strict";

    return BaseController.extend("CriptAnaliser.src.pages.settings.Edit", {

        onInit : function () {

            this
            .getRouter()
            .getRoute('settings')
            .attachPatternMatched(this._onRouteMatched, this);

            

        },
        _onRouteMatched : function(oEvent){        
        },
        Save : function(oEvent)     {

        },
        _onNavRouter:function(oEvent){
            let Router = oEvent.getSource().data("router");
            this.getRouter().navTo(Router);
        }
    });
});
