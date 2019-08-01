sap.ui.define(
	[
	"CriptAnaliser/src/app/BaseController",		
	"CriptAnaliser/model/RestModel",
	], 
	function (BaseController, RestModel) {
		"use strict";

		return BaseController.extend("CriptAnaliser.src.pages.DateAnalise.DateAnalise", {
			onInit : function(){
				this.setModel(new RestModel(this.getCoins()), "Coins");
				this.setModel(new RestModel({SelectedCoin : "BTC"}), "View");
				
			},	
			
			getCoins(){
				let coins = [
					{ Key : "BTC", Value : "Bitcoin"},
					{ Key : "LTC", Value : "Litecoin"},
					{ Key : "BCH", Value : "BCash"},
					{ Key : "XRP", Value : "XRP (Ripple)"},
					{ Key : "ETH", Value : "Ethereum"},
				]
				return coins;
			},

			onFind(){
				let control = this.byId("DRS1");
				
				if(!control.getFrom() || !control.getTo()){
					  control.setValueState("Error");
					  return;
				}
				
				control.setValueState("None");
				this.getApiDataRange(control.getFrom(), control.getTo());
			},

			getApiDataRange(from, to){
				console.log(from);
				this.getApiData(from.toLocaleDateString())
				.then(data =>{					
					if(from < to){
						from = this.addDays(from, 1);
						this.getApiDataRange(from, to);					
						this.pushModel(data);
					}
				})
			},
			getSelectedCoin()	{
				return this.getModel("View").getProperty("/SelectedCoin");
			},
			getApiData(date){
				let coin = this.getSelectedCoin();
				let day = this.formatDataToApi(date);
				let url = `https://www.mercadobitcoin.net/api/${coin}/day-summary/${date}`;
				let that = this; 
				let pro = (resolve, reject)=>{
					var data = null;

					var xhr = new XMLHttpRequest();
					xhr.addEventListener("readystatechange", function () {
						
						if(this.status == 200 && this.readyState == 4){
							let res = JSON.parse(this.responseText);
							res.coin = that.getSelectedCoin();
							resolve(res);
						}
					});

					xhr.open("GET", url);			
					xhr.send(data);
				}
				 
				return new Promise(pro);
				
			},
			formatDataToApi(data){
				if(data[2] != '/') return data;

				return data.split("/").reverse().join("/");
			},

			geYyesterday(){
				let today = new Date();
				let before =  new Date(today.getFullYear(), today.getMonth(), today.getDate() -1).toLocaleDateString();
				return before;
			},
		});
	}
);
