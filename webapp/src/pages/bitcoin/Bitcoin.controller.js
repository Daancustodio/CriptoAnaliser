sap.ui.define(
	[
	"CriptAnaliser/src/app/BaseController",		
	"CriptAnaliser/model/RestModel",
	"CriptAnaliser/controls/invCharts/MultiLineChart",
	], 
	function (BaseController, RestModel, MultiLineChart) {
		"use strict";

		return BaseController.extend("CriptAnaliser.src.pages.bitcoin.Bitcoin", {
			onInit : function(){
				console.log("controller [Bitcoin] Inicializado");
				this.getLastDaysData(8);
				let data = {
					types : [
						{type:'bar',name:"Barra"},
						{type:'line',name:"Linhas"},
						{type:'bubble',name:"Bolhas"},
					],
					selectedType: "bar"
				}
				this.setModel(new RestModel(data), "Chart"); 
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
					}else{										
						this.showChart();
					}
				})
			},
			showChart(type){				
				let data = this.getChartData();	
				this.multiLineChart = this.byId('multiLineChart');	
				this.multiLineChartBar = this.byId('multiLineChartBar');	

				this.chartCanvas = this.multiLineChart.show(data.dataSets, data.labels, type);
				this.chartCanvasBar = this.multiLineChartBar.show(data.dataSets, data.labels, type);
			},
			getChartData(){
				let chartColors = {
					red: 'rgb(255, 99, 132)',
					orange: 'rgb(255, 159, 64)',
					yellow: 'rgb(255, 205, 86)',
					green: 'rgb(75, 192, 192)',
					blue: 'rgb(54, 162, 235)',
					purple: 'rgb(153, 102, 255)',
					grey: 'rgb(201, 203, 207)'
				}; 
				let data = this.getModel("LastDays").getData();
				let max = {fill : false, label: "Máxima", backgroundColor: chartColors.green, borderColor: chartColors.green};
				let lowest = {fill :false, label: "Mínima", backgroundColor: chartColors.red, borderColor: chartColors.red};
				let diff = {fill :true, label: "Variação", backgroundColor: chartColors.yellow, borderColor: chartColors.yellow};
				
				let open = {fill :false, label: "Abertura", backgroundColor: chartColors.orange, borderColor: chartColors.orange};
				let close = {fill :false, label: "Fechamento", backgroundColor: chartColors.blue, borderColor: chartColors.blue};
				max.data = data.map(x => x.highest.toFixed(2))
				lowest.data = data.map(x => x.lowest.toFixed(2))
				open.data = data.map(x => x.opening.toFixed(2))
				close.data = data.map(x => x.closing.toFixed(2))
				lowest.data = data.map(x => x.lowest.toFixed(2))
				
				diff.data = data.map(x => (x.highest - x.lowest).toFixed(2));

				let labels = data.map(x => `${x.day}/${x.month}/${x.year}`);				
				let dataSets = [open, lowest, max, close];		
					
				return {dataSets, labels};
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
							let foundedDate = new Date(res.date);
							res.coin = "BTC"
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
