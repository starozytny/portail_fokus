const axios = require("axios");
const Formulaire = require("@commonFunctions/formulaire");
const List = require("@commonFunctions/list");

function getData (self, url, perPage, sorter, highlight = null)
{
	axios({ method: "GET", url: url, data: {} })
		.then(function (response) {
			let data = [];
			let dataImmuable = [];

			JSON.parse(response.data.donnees).forEach(elem => {
				let elemInventories = [];
				let canActions = true;
				JSON.parse(response.data.inventories).forEach(inventory => {
					if(inventory.propertyUid === elem.uid || elem.isImported !== 0
						|| elem.lastInventoryUid !== 0 || elem.lastInventoryUid === ""
					){
						canActions = false;
					}

					if(inventory.propertyUid === elem.uid){
						elemInventories.push(inventory)
					}
				})

				elem.canActions = canActions;
				elem.inventories = elemInventories;

				data.push(elem);
				dataImmuable.push(elem);
			})

			data.sort(sorter);
			dataImmuable.sort(sorter);

			let [currentData, currentPage] = List.setCurrentPage(highlight, data, perPage);

			self.setState({
				data: data, dataImmuable: dataImmuable, currentData: currentData,
				users: JSON.parse(response.data.users),
				models: JSON.parse(response.data.models),
				tenants: JSON.parse(response.data.tenants),
				currentPage: currentPage,
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
