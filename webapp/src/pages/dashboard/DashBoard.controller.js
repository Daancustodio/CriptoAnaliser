sap.ui.define(
	[
		"CriptAnaliser/src/app/BaseController",
		"sap/m/MessageToast",
		'CriptAnaliser/model/RestModel',

	],
	function (BaseController, MessageToast, RestModel) {
	"use strict";

	return BaseController.extend("CriptAnaliser.src.pages.dashboard.DashBoard", {

		onInit : function () {
			this.veiculos = "http://fipeapi.appspot.com/api/1/carros/veiculos/";
			this.veiculo = "http://fipeapi.appspot.com/api/1/carros/veiculo/";
			this.ApiRoot = "http://fipeapi.appspot.com/api/1/carros/";

			this.loadMarcas();
		},

		loadMarcas(){
			let url = this.ApiRoot + "/marcas.json"
			let model = new RestModel();
			model.setUseFetch(false)
			model.get(url).then(()=>{
				let item = this.byId("selectMarca").getSelectedItem().getBindingContext("marcas").getObject();
				this.updateURLs(item);
				this.getLoadCars()

			}).catch(this.showExeption);
			this.setModel(model, "marcas")
		},

		updateVeicleSelected(oEvent){
			let marca = oEvent.getParameters();
			let obj = marca.selectedItem.getBindingContext('marcas').getObject();
			this.updateURLs(obj)
			this.getLoadCars()
		},

		updateURLs(obj){
			this.setModel(new RestModel(obj), "selectedCompany");
			this.veiculo = `${this.ApiRoot}veiculo/${obj.id}`;
			this.veiculos = `${this.ApiRoot}veiculos/${obj.id}`;
		},

		onFakeEx(oEvent){
			var model = new RestModel();
			let url = this.getServerUrl("FakeException.json")
			let controlToSetBusy = this.getView();
			var p = model.get(url, controlToSetBusy);
			p.then(this.showExeption)
			p.catch(this.showExeption)
		},

		getLoadCars(oEvent){
			let url = `${this.veiculos}.json`;
			let model = new RestModel();
			model.setUseFetch(false)
			model.get(url).catch(this.showExeption)
			this.setModel(model, "fipe");
		},

		loadCarModels(oEvent){
			let path = oEvent.getSource().getBindingContextPath();
			let idPath = `${path}/id`;
			let id = this.getModel("fipe").getProperty(idPath)

			if (!this._dialogModelsAndYear) {
				this._dialogModelsAndYear = sap.ui.xmlfragment("CriptAnaliser.src.pages.centercosts.ChooseFromModal", this);
                this._dialogModelsAndYear.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}

			this.SelectedCarUrl = `${this.veiculo}/${id}`;
			let url = this.SelectedCarUrl + ".json";
			let model = new RestModel();
			const mapCarFields = x =>  {
				return {
					Title : `${x.fipe_marca} ${(x.veiculo || "")}`,
					Description : `${x.key}`}
			};
			model.attachRequestCompleted(x =>{
				let data = model.getData().map(mapCarFields)
				model.setData(data);
			});
			model.attachRequestFailed((err) => {ctx.showExeption([{message : "Ocorreu um erro ao processar a solicitação"}])});
			model.loadData(url)

			this._dialogModelsAndYear.attachConfirm((oEvent)=> this.loadCarValue(oEvent, this, this.SelectedCarUrl))
			this._dialogModelsAndYear.setModel(model);
			this._dialogModelsAndYear.open()

		},

		loadCarValue(oEvent, ctx, url)  {
			var selectedModel = oEvent.getParameters().selectedItem.getBindingContext().getObject().Description;

			url = `${url}/${selectedModel}.json`;

			let modelCar = new RestModel()
			modelCar.attachRequestFailed((err) => {ctx.showExeption([{message : "Ocorreu um erro ao processar a solicitação"}])});
			modelCar.attachRequestCompleted((req)=>{
				if(!req.getParameter("success")) return;
				ctx.showDialogPriceView(modelCar);
			})
			modelCar.loadData(url)
		},

		showDialogPriceView: function (model) {

			if (!this.DialogPriceView) {
				this.DialogPriceView = this.getDialog()

			}
			this.DialogPriceView.setModel(model)
			this.DialogPriceView.open();
		},

		getDialog(){
			let vBox = new sap.m.VBox();
			vBox.addStyleClass("sapUiTinyMargin")
			vBox.addItem(new sap.m.Title({text : "{/preco} em {/referencia}", level:"H2" }));
			vBox.addItem(new sap.m.Label({text : "Combustivel: {/combustivel}" }));
			vBox.addItem(new sap.m.Label({text : "Ano: {/ano_modelo}" }));
			vBox.addItem(new sap.m.Label({text : "Marca: {/marca}" }));
			vBox.addItem(new sap.m.Label({text : "Modelo: {/name}" }));
			vBox.addItem(new sap.m.Label({text : "Código Fipe: {/fipe_codigo}" }));

			return new sap.m.Dialog({
				contentWidth: "40%",
				resizable: true,
				title: '{/marca} {/name}',
				content: vBox,
				beginButton: new sap.m.Button({
					text: 'Close',
					press: function () {
						this.DialogPriceView.close();
					}.bind(this)
				})
			});
		},

		filterCars(oEvent){
			let query = oEvent.getParameter("query");
			let oBinding = this.byId("fipeList").getBinding("items"),
				aFilters = [],
				filterStatus;

			filterStatus = new sap.ui.model.Filter("fipe_name",  sap.ui.model.FilterOperator.Contains, query);
			aFilters.push(filterStatus);
			oBinding.filter(aFilters);

		}


	});

});
