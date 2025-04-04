const axios = require("axios");
const Formulaire = require("@commonFunctions/formulaire");
const List = require("@commonFunctions/list");

function getData (self, url, perPage, sorter, highlight = null)
{
	axios({ method: "GET", url: url, data: {} })
		.then(function (response) {
			let data = [];
			let dataImmuable = [];

			let inventories = JSON.parse(response.data.donnees);
			let entryInventories = JSON.parse(response.data.entryInventories);
			let v1entryInventories = JSON.parse(response.data.v1entryInventories);
			let properties = JSON.parse(response.data.properties);
			let users = JSON.parse(response.data.users);
			let models = JSON.parse(response.data.models);
			let tenants = JSON.parse(response.data.tenants);

			data.sort(sorter);
			dataImmuable.sort(sorter);

			inventories.forEach(elem => {
				elem.property = null;
				elem.user = null;
				elem.model = null;
				elem.tenantsData = [];
				elem.uidEntryForAi = null;

				if(elem.input !== 0 && elem.type === 0){
					let entrant = entryInventories.find(el => el.uid === elem.input && el.type === 1 && el.propertyUid === elem.propertyUid);
					if(entrant){
						elem.uidEntryForAi = entrant.uid
					}else{
						entrant = v1entryInventories.find(el => el.uid === elem.input && el.type === 1 && el.propertyUid === elem.propertyUid);
						if(entrant){
							elem.uidEntryForAi = entrant.uid
						}
					}
				}

				properties.forEach(pr => {
					if(pr.uid === elem.propertyUid){
						elem.property = pr;
					}
				})

				users.forEach(us => {
					if(us.id === elem.userId){
						elem.user = us;
					}
				})

				if(elem.input < 0){
					models.forEach(mo => {
						if(mo.id === Math.abs(elem.input)){
							elem.model = mo;
						}
					})
				}

				if(elem.tenants){
					JSON.parse(elem.tenants).forEach(te => {
						tenants.forEach(tenant => {
							if(te === tenant.reference){
								elem.tenantsData.push(tenant)
							}
						})
					})

				}

				data.push(elem);
				dataImmuable.push(elem);
			})

			data.sort(sorter);
			dataImmuable.sort(sorter);

			let [currentData, currentPage] = List.setCurrentPage(highlight, data, perPage);

			self.setState({
				data: data, dataImmuable: dataImmuable, currentData: currentData,
				properties: properties,
				users: users,
				tenants: tenants,
				models: models,
				currentPage: currentPage,
				hasAi: response.data.hasAi,
				loadingData: false
			});
		})
		.catch(function (error) {
			Formulaire.displayErrors(self, error);
		})
	;
}

module.exports = {
	getData
}
