sap.ui.define([
    "sap/m/SearchField",
    "CriptAnaliser/model/formatter"
], function (SearchField, formatter) {
	"use strict";
	return SearchField.extend("CriptAnaliser.controls.CenterCostsSearch", {
		metadata : {
            properties : {
				dimension: 	{type : "int", defaultValue :-1}
			}
        },

		init : function () {

        },
        renderer : {}
	});
});
