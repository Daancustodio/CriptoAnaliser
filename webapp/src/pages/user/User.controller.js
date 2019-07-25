sap.ui.define(
	[
		"CriptAnaliser/src/app/BaseController",
		"sap/m/MessageToast",
		'CriptAnaliser/model/RestModel'	,

	],
	function (BaseController, MessageToast, RestModel) {
	"use strict";

	return BaseController.extend("CriptAnaliser.src.pages.user.User", {

		onInit : function () {
			console.log("Inicializado")	;
		},




	});

});
