import React, { Component } from "react";

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { InventoriesLightList } from "@userPages/Inventories/Light/InventoriesLightList";

import { Search } from "@tailwindComponents/Elements/Search";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const SESSION_PERPAGE = "project.perpage.fk_inventories_l";

export class InventoriesLight extends Component {
	constructor (props) {
		super(props);
		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, 5),
			currentPage: 0,
			sorter: Sort.compareDate,
			loadingData: true,
			element: null,
			properties: [],
			users: [],
			tenants: [],
			models: [],
		}

		this.pagination = React.createRef();
	}

	componentDidMount = () => {
		this.handleGetData();
	}

	handleGetData = () => {
		const { donnees, property, properties, users, models, tenants } = this.props;
		const { perPage, sorter } = this.state;

		let data = [];
		let dataImmuable = [];

		data.sort(sorter);
		dataImmuable.sort(sorter);

		donnees.forEach(elem => {
			elem.property = property;
			elem.user = null;
			elem.model = null;
			elem.tenantsData = [];

			if(property == null){
				properties.forEach(pr => {
					if(pr.uid === elem.propertyUid){
						elem.property = pr;
					}
				})
			}

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

		let [currentData, currentPage] = List.setCurrentPage(null, data, perPage);

		this.setState({
			data: data, dataImmuable: dataImmuable, currentData: currentData,
			properties: properties,
			users: users,
			tenants: tenants,
			models: models,
			currentPage: currentPage,
			loadingData: false
		});
	}

	handleUpdateData = (currentData) => {
		this.setState({ currentData })
	}

	handleSearch = (search) => {
		const { perPage, sorter, dataImmuable } = this.state;
		List.search(this, 'fokus_inventory', search, dataImmuable, perPage, sorter)
	}

	handleUpdateList = (element, context) => {
		const { data, dataImmuable, currentData, sorter } = this.state;
		List.updateListPagination(this, element, context, data, dataImmuable, currentData, sorter)
	}

	handlePaginationClick = (e) => {
		this.pagination.current.handleClick(e)
	}

	handleChangeCurrentPage = (currentPage) => {
		this.setState({ currentPage });
	}

	handlePerPage = (perPage) => {
		List.changePerPage(this, this.state.data, perPage, this.state.sorter, SESSION_PERPAGE);
	}

	render () {
		const { property } = this.props;
		const { data, currentData, loadingData, perPage, currentPage } = this.state;

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-2 w-full flex flex-row">
						<Search onSearch={this.handleSearch} placeholder="Rechercher par reference, adresse, code postal, ville, locataire, propriétaire.." />
					</div>

					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage}
										 onClick={this.handlePaginationClick}
										 onPerPage={this.handlePerPage} />

					<InventoriesLightList data={currentData} property={property} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />
				</>
			}
		</>
	}
}
