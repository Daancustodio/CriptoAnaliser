

sap.ui.define(
	[
	"CriptAnaliser/src/app/BaseController",		
	"CriptAnaliser/model/RestModel",
	], 
	function (BaseController, RestModel) {
		"use strict";

		return BaseController.extend("CriptAnaliser.src.pages.criptoAnalizer.CriptoAnalizer", {
			onInit : function(){
			/* 	this.attachToAddOnenter("inputDay")
				this.attachToAddOnenter("inputMonth")
				this.attachToAddOnenter("inputYear") */
				this.setModel(new RestModel([]));				
				this.setModel(new RestModel(this.getCoins()), "Coins");
				this.setModel(new RestModel({SelectedCoin : "BTC"}), "View");
				this.loadTickers()
				setInterval(()=>this.loadTickers(), 25000)
			},	
			loadTickers(){
				this.setModel(new RestModel([]), "Tickers");			
				let coins = this.getCoins();				
				let tickersModel = this.getModel("Tickers");
				let modelData =tickersModel.getData();
				coins.forEach(coin => {
					this.getTicker(coin.Key)
					.then(data =>{
						modelData.push(data);
						modelData.sort((a,b) => {
							if(a.coin < b.coin)
								return -1;
							if(a.coin > b.coin)
								return 1;
							return 0;
						});
						
						tickersModel.setData(modelData);
					})
				});
			},
			getSelectedCoin()	{
				return this.getModel("View").getProperty("/SelectedCoin");
			},
			onClean(){
				this.setModel(new RestModel([]));
			},
			handleRangeChange(oEvent){
				let from = oEvent.getParameter('from');
				let to = oEvent.getParameter('to');
				this.getApiDataRange(from, to);
			}
			,
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
			addDays(date, days) {
				var result = new Date(date);
				result.setDate(result.getDate() + days);
				return result;
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
					}else{
						this.buildChart()
					}
				})
			},
			buildChart(){				
				let chartColors = {
					red: 'rgb(255, 99, 132)',
					orange: 'rgb(255, 159, 64)',
					yellow: 'rgb(255, 205, 86)',
					green: 'rgb(75, 192, 192)',
					blue: 'rgb(54, 162, 235)',
					purple: 'rgb(153, 102, 255)',
					grey: 'rgb(201, 203, 207)'
				}; 
				let control = this.byId('multiLineChart');
				let data = this.getModel().getData();
				let max = {fill : false, label: "Máxima", backgroundColor: chartColors.green, borderColor: chartColors.green};
				let lowest = {fill :false, label: "Mínima", backgroundColor: chartColors.red, borderColor: chartColors.red};
				let diff = {fill :false, label: "Variação", backgroundColor: chartColors.yellow, borderColor: chartColors.yellow};
				max.data = data.map(x => x.highest.toFixed(2))
				lowest.data = data.map(x => x.lowest.toFixed(2))
				diff.data = data.map(x => (x.highest - x.lowest).toFixed(2));
				let labels = data.map(x => `${x.day}/${x.month}/${x.year}`);				
				let dataSets = [max, lowest, diff];				
				control.show(dataSets, labels);
			},
			getApiData(date){
				let url = `https://www.mercadobitcoin.net/api/${this.getSelectedCoin()}/day-summary/${this.formatDataToApi(date)}`;
				let that = this; 
				let pro = (resolve, reject)=>{
					var data = null;

					var xhr = new XMLHttpRequest();
					xhr.addEventListener("readystatechange", function () {
						
						if(this.status == 200 && this.readyState == 4){
							let res = JSON.parse(this.responseText);
							let foundedDate = new Date(res.date);
							res.coin = that.getSelectedCoin();
							res.day = foundedDate.getDate()
							res.month = foundedDate.getMonth() + 1;
							res.year = foundedDate.getFullYear();
							resolve(res);
						}
					});

					xhr.open("GET", url);			
					xhr.send(data);
				}
				 
				return new Promise(pro);

				
			},

			getTicker(coin){

				let url = `https://www.mercadobitcoin.net/api/${coin}/ticker/`;			
				let that = this; 
				let pro = (resolve, reject)=>{
					var data = null;

					var xhr = new XMLHttpRequest();
					xhr.addEventListener("readystatechange", function () {
						
						if(this.status == 200 && this.readyState == 4){
							let res = JSON.parse(this.responseText);
							let ticker = res.ticker;
							ticker.coin = coin;
							ticker.date = "Hoje"
							ticker.low = Number.parseFloat(ticker.low)
							ticker.high = Number.parseFloat(ticker.high)
							ticker.last = Number.parseFloat(ticker.last)
							var totalDiferenca = ticker.high - ticker.low;
							var atual = (ticker.last - ticker.low) * (100 / totalDiferenca)
							ticker.percent = Math.round(atual);
							resolve(res.ticker);
						}
					});

					xhr.open("GET", url);			
					xhr.send(data);
				}
				 
				return new Promise(pro);

				
			},



			pushModel(data){
				let model = this.getModel().getData();
				model.push(data);
				this.getModel().setData(model);
			},
			/// entrada DD/MM/YYYY
			/// SAida YYYY/MM/DD
			///
			formatDataToApi(data){
				if(data[2] != '/') return data;

				return data.split("/").reverse().join("/");
			},

			geYyesterday(){
				let today = new Date();
				let before =  new Date(today.getFullYear(), today.getMonth(), today.getDate() -1).toLocaleDateString();
				return before;
			},

			onAdd(data){
				this.getApiData(data)
				.then(res => this.pushModel(res))	
			},

			onAddButton(oEvent){				
				let day = this.byId("inputDay").getValue()
				let month = this.byId("inputMonth").getValue()
				let year = this.byId("inputYear").getValue()
				let date = `${day}/${month}/${year}`;
				this.onAdd(date);
			},

			attachToAddOnenter(controlId){
				let that = this;
				this.byId(controlId).attachBrowserEvent("keypress", oEvent =>{
					if(oEvent.keyCode != jQuery.sap.KeyCodes.ENTER) return;
	
					that.onAddButton();
				});
			}

		});
	}
);
