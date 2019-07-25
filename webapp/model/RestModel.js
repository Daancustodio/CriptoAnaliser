jQuery.sap.require("sap.ui.model.json.JSONModel");

sap.ui.model.json.JSONModel.extend(
	"CriptAnaliser.model.RestModel",
	{
		baseUrl: "",
		fillData : true,
		useFetch : true,
		requestSettings: {
			method: 'GET',
			headers : {
				'Content-Type': 'application/json'
			},
			xhrFields: {
				withCredentials: false
			}
		},

		setWithCredentials(boolValue){
			this.xhrFields.withCredentials = boolValue;
		},
		setBaseUrl(url){
			this.baseUrl = url;
		},

		setUseFetch(bool){
			this.useFetch = bool;
		},

		request(url, busyControl)  {
			if(!this.useFetch) return this.requestByJquery(url, busyControl);
			fetch
			let that = this;
			if (busyControl) busyControl.setBusy(true);

			const finaly = function () {
				if (busyControl) busyControl.setBusy(false);
			};
			let promisseResolution = (resolve, reject) =>
			{
				fetch(url, this.requestSettings)
				.then((response) => {
					that.response = response;
					if (!response.ok){
						response.json().then(jsonError => {
							reject(jsonError);
						})
					}
					else{
						if(that.fillData){
							response.json().then(dataJSON =>{
								that.setData(dataJSON);
								resolve(dataJSON);
							});
						}else{
							resolve(response);
						}
					}
				})
				.catch(err =>{
					that.response = response;
					err.json().then(jsonError =>{
						reject(jsonError);
					})
				})
				.finally(finaly);
			}

			return new Promise(promisseResolution);

		},

		requestByJquery(url, busyControl) {


			if (busyControl) busyControl.setBusy(true);

			const promisseResolution = (resolve, reject) => {
				this.attachRequestFailed(err => reject(err));
				this.attachRequestCompleted((req)=>{
					if (busyControl)busyControl.setBusy(false);
					if(req.getParameter("success"))
						resolve(req);
					else
						reject(req);
				});

				this.loadData(url)
			}

			return new Promise(promisseResolution)

		},

		getResponse: function () {
			return this.oResponse;
		},

		post: function (url, controlToBusy) {
			let data = JSON.stringify(this.getData());
			this.requestSettings.body = data;
			this.requestSettings.method = "POST";
			return this.request(url, controlToBusy);
		},

		put: function (url, controlToBusy) {
			let data = JSON.stringify(this.getData());
			this.requestSettings.body = data;
			this.requestSettings.method = "PUT";
			return this.request(url, controlToBusy);
		},

		patch: function (url, controlToBusy) {
			let data = JSON.stringify(this.getData());
			this.requestSettings.body = data;
			this.requestSettings.method = "PATCH";
			return this.request(url, controlToBusy);
		},

		get(url, controlToBusy) {
			this.requestSettings.method = "GET";
			delete this.requestSettings.body;
			return this.request(url, controlToBusy);
		},

		delete: function (url, controlToBusy) {
			this.requestSettings.method = "DELETE";
			return this.request(url, controlToBusy);
		},

		setHeader(name, value) {
			this.requestSettings.headers[name] = value;
		},

		read(path, controlToBusy){
			if(this.baseUrl == "") {
				console.log("Para utilizar esse método é necessário informar a URL base");
				return;
			}
			let url = this.baseUrl + path;
			return this.get(url, controlToBusy);
		}

	});
