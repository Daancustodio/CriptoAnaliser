sap.ui.define(
	[
	"CriptAnaliser/src/app/BaseController",		
	"CriptAnaliser/model/RestModel",
	], 
	function (BaseController, RestModel) {
		"use strict";

		return BaseController.extend("CriptAnaliser.src.pages.bitcoin.Bitcoin", {
			onInit : function(){
				console.log("controller [Bitcoin] Inicializado");
				this.getLastDaysData(7);
			},		
			getLastDaysData(lastDaysCount){
				this.setModel(new RestModel([]), "LastDays");
				let now = new Date();				
				let startDate = new Date();
				startDate.setDate( now.getDate() - lastDaysCount);
				this.getApiDataRange(startDate, now);

			},
			getApiDataRange(from, to){
				console.log(from);
				this.getApiData(from.toLocaleDateString())
				.then(data =>{					
					if(from < to){
						from = this.addDays(from, 1);
						this.getApiDataRange(from, to);					
						this.pushModelLastDays(data);
					}
				})
			},
			addDays(date, days) {
				var result = new Date(date);
				result.setDate(result.getDate() + days);
				return result;
			  },
			getApiData(date){
				let url = `https://www.mercadobitcoin.net/api/BTC/day-summary/${this.formatDataToApi(date)}`;
				let that = this; 
				let pro = (resolve, reject)=>{
					var data = null;

					var xhr = new XMLHttpRequest();
					xhr.addEventListener("readystatechange", function () {
						
						if(this.status == 200 && this.readyState == 4){
							let res = JSON.parse(this.responseText);
							res.coin = "BTC"
							resolve(res);
						}
					});

					xhr.open("GET", url);			
					xhr.send(data);
				}
				 
				return new Promise(pro);

				
			},

			pushModelLastDays(data){
				let model = this.getModel("LastDays");
				let modelData = model.getData();
				modelData.push(data);
				this.getModel("LastDays").setData(modelData);
			},
			
			formatDataToApi(data){
				if(data[2] != '/') return data;

				return data.split("/").reverse().join("/");
			},
		});
	}
);
