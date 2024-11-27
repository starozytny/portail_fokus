import React, { Component } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { BiensList } from "@userPages/Biens/BiensList";
import { BienFormulaire } from "@userPages/Biens/BienForm";

import { Button } from "@tailwindComponents/Elements/Button";
import { Modal } from "@tailwindComponents/Elements/Modal";
import { Search } from "@tailwindComponents/Elements/Search";
import { ModalDelete } from "@tailwindComponents/Shortcut/Modal";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_GET_DATA = "intern_api_fokus_properties_list";
const URL_DELETE_ELEMENT = "intern_api_fokus_properties_delete";

const SESSION_PERPAGE = "project.perpage.fk_biens";

export class Biens extends Component {
	constructor (props) {
		super(props);
		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, props.onSelector ? 5 : 20),
			currentPage: 0,
			sorter: Sort.compareAddr1,
			loadingData: true,
			element: null,
		}

		this.pagination = React.createRef();
		this.delete = React.createRef();
		this.form = React.createRef();
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
							if(inventory.propertyUid === elem.uid || elem.isImported !== "0"
								|| elem.lastInventoryUid !== "0" || elem.lastInventoryUid === ""
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
		List.search(this, 'fokus_property', search, dataImmuable, perPage, sorter)
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
		const { highlight, onSelector, propertiesSelected } = this.props;
		const { data, currentData, element, loadingData, perPage, currentPage } = this.state;

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-2 flex flex-col gap-4 md:flex-row">
						<div className="md:w-[258px]">
							<Button type="blue" iconLeft="add" width="w-full" onClick={() => this.handleModal('form', null)}>
								Ajouter un bien
							</Button>
						</div>
						<div className="w-full flex flex-row">
							<Search onSearch={this.handleSearch} placeholder="Rechercher par reference, adresse, code postal, ville, locataire, propriétaire.." />
						</div>
					</div>

					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage}
										 onClick={this.handlePaginationClick}
										 onPerPage={this.handlePerPage} />

					<BiensList data={currentData}
							   propertiesSelected={propertiesSelected}
							   highlight={parseInt(highlight)}
							   onModal={this.handleModal}
							   onSelector={onSelector} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />

					{createPortal(<ModalDelete refModal={this.delete} element={element} routeName={URL_DELETE_ELEMENT}
											   title="Supprimer ce bien" msgSuccess="Bien supprimé"
											   onUpdateList={this.handleUpdateList}>
						Êtes-vous sûr de vouloir supprimer définitivement ce bien : <b>{element ? element.addr1 : ""}</b> ?
					</ModalDelete>, document.body)}

					{createPortal(<Modal ref={this.form} identifiant='form-property' maxWidth={568} margin={5} zIndex={42}
										 title={element ? `Modifier ${element.addr1}` : "Ajouter un bien"}
										 isForm={true}
										 content={<BienFormulaire context={element ? "update" : "create"} element={element ? element : null}
																  identifiant="form-property" key={element ? element.id : 0} />}
					/>, document.body)}
				</>
			}
		</>
	}
}
