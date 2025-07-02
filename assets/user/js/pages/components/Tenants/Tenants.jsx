import React, { Component } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { TenantsList } from "@userPages/Tenants/TenantsList";
import { TenantFormulaire } from "@userPages/Tenants/TenantForm";
import { TenantDetails } from "@userPages/Tenants/TenantDetails";

import { Modal } from "@tailwindComponents/Elements/Modal";
import { Button } from "@tailwindComponents/Elements/Button";
import { Search } from "@tailwindComponents/Elements/Search";
import { ModalDelete } from "@tailwindComponents/Shortcut/Modal";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_GET_DATA = "intern_api_fokus_tenants_list";
const URL_DELETE_ELEMENT = "intern_api_fokus_tenants_delete";

const SESSION_PERPAGE = "project.perpage.fk_tenants";

export class Tenants extends Component {
	constructor (props) {
		super(props);
		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, props.onSelector ? 5 : 20),
			currentPage: 0,
			sorter: Sort.compareLastName,
			loadingData: true,
			element: null,
			users: [],
			models: [],
			properties: [],
		}

		this.pagination = React.createRef();
		this.delete = React.createRef();
		this.form = React.createRef();
		this.details = React.createRef();
	}

	componentDidMount = () => {
		this.handleGetData();
	}

	handleGetData = () => {
		const { numSociety, highlight, donnees } = this.props;
		const { perPage, sorter } = this.state;

		if(donnees){
			List.setData(this, donnees, perPage, sorter, highlight)
		}else{
			const self = this;
			axios({ method: "GET", url: Routing.generate(URL_GET_DATA, {numSociety: numSociety}), data: {} })
				.then(function (response) {
					let data = [];
					let dataImmuable = [];

					JSON.parse(response.data.donnees).forEach(elem => {
						let elemInventories = [];
						let canActions = true;
						JSON.parse(response.data.inventories).forEach(inventory => {
							if(inventory.tenants !== ""){
								let removeDollars = inventory.tenants.replaceAll("$", "")
								JSON.parse(removeDollars).forEach(tenant => {
									let nRef = elem.reference ? elem.reference.replaceAll("$", "") : "";

									if(tenant === nRef){
										canActions = false;

										elemInventories.push(inventory)
									}
								})
								if(elem.isImported !== 0 ){
									canActions = false;
								}
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
						properties: JSON.parse(response.data.properties),
						currentPage: currentPage,
						loadingData: false })
				})
			;
		}
	}

	handleUpdateData = (currentData) => {
		this.setState({ currentData })
	}

	handleSearch = (search) => {
		const { perPage, sorter, dataImmuable } = this.state;
		List.search(this, 'fokus_tenant', search, dataImmuable, perPage, sorter)
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

	handleModal = (identifiant, elem, assign) => {
		this[identifiant].current.handleClick();
		this.setState({ element: elem, assign: assign })
	}

	render () {
		const { highlight, onSelector, tenantsSelected } = this.props;
		const { data, dataImmuable, currentData, element, loadingData, perPage, currentPage, users, models, properties } = this.state;

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-2 flex flex-col gap-4 md:flex-row">
						<div className="md:w-[258px]">
							<Button type="blue" iconLeft="add" width="w-full" onClick={() => this.handleModal('form', null)}>
								Ajouter un locataire
							</Button>
						</div>
						<div className="w-full flex flex-row">
							<Search onSearch={this.handleSearch} placeholder="Rechercher par locataire, reference, adresse.." />
						</div>
					</div>

					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage}
										 onClick={this.handlePaginationClick}
										 onPerPage={this.handlePerPage} />

					<TenantsList data={currentData}
								 tenantsSelected={tenantsSelected}
								 highlight={parseInt(highlight)}
								 onModal={this.handleModal}
								 onSelector={onSelector} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />

					{createPortal(<Modal ref={this.form} identifiant='form-tenant' maxWidth={568} margin={5}
										 title={element ? `Modifier ${element.lastName} ${element.firstName}` : "Ajouter un locataire"}
										 isForm={true}
										 content={<TenantFormulaire context={element ? "update" : "create"} element={element ? element : null}
																	onUpdateList={onSelector ? this.handleUpdateList : null}
																	identifiant="form-tenant" key={element ? element.id : 0} />}
					/>, document.body)}

					{onSelector
						? null
						: <>
							{createPortal(<ModalDelete refModal={this.delete} element={element} routeName={URL_DELETE_ELEMENT}
													   title="Supprimer ce locataire" msgSuccess="Locataire supprimé"
													   onUpdateList={this.handleUpdateList}>
								Êtes-vous sûr de vouloir supprimer définitivement ce locataire : <b>{element ? element.name : ""}</b> ?
							</ModalDelete>, document.body)}

							{createPortal(<Modal ref={this.details} identifiant='details-tenant' maxWidth={1024} margin={1}
												 title={element ? `Détails de ${element.lastName} ${element.firstName}` : ""}
												 content={element
													 ? <TenantDetails elem={element} key={element.id}
																	 users={users} models={models} tenants={dataImmuable} properties={properties} />
													 :	null
												 }
							/>, document.body)}
						</>
					}
				</>
			}
		</>
	}
}
