import React, { Component } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";
import Formulaire from "@commonFunctions/formulaire";
import PropertiesFunctions from "@userFunctions/properties";

import { BiensList } from "@adminPages/Fokus/Biens/BiensList";

import { Modal } from "@tailwindComponents/Elements/Modal";
import { Button } from "@tailwindComponents/Elements/Button";
import { Search } from "@tailwindComponents/Elements/Search";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_INDEX_ELEMENTS = "admin_fokus_properties_list";
const URL_GET_DATA = "intern_api_fokus_properties_list";
const URL_ASSIGN_ELEMENT = "intern_api_fokus_properties_assign";

const SESSION_PERPAGE = "project.perpage.fk_biens";

export class Biens extends Component {
	constructor (props) {
		super(props);
		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, props.isAssignation ? 5 : 20),
			currentPage: 0,
			sorter: Sort.compareAddr1,
			loadingData: true,
			element: props.element ? props.element : null,
			assign: null,
		}

		this.pagination = React.createRef();
		this.lastInventory = React.createRef();
		this.confirmAssign = React.createRef();
	}

	componentDidMount = () => {
		this.handleGetData();
	}

	handleGetData = () => {
		const { numSociety, highlight, donnees, isAssignation } = this.props;
		const { perPage, sorter } = this.state;

		if(isAssignation){
			List.setData(this, donnees, perPage, sorter, highlight);
		}else{
			PropertiesFunctions.getData(this, Routing.generate(URL_GET_DATA, {numSociety: numSociety}), perPage, sorter, highlight);
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

	handleAssign = () => {
		const { element, numSociety } = this.props;
		const { assign } = this.state;

		let self = this;
		Formulaire.loader(true);
		axios({ method: "PUT", url: Routing.generate(URL_ASSIGN_ELEMENT, {numSociety: numSociety}), data: {elemId: element.id, selectedId: assign.id} })
			.then(function (response) {
				location.href = Routing.generate(URL_INDEX_ELEMENTS, { numSociety: numSociety, h: element.id });
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
				Formulaire.loader(false);
			})
		;
	}

	render () {
		const { numSociety, highlight, isAssignation } = this.props;
		const { data, dataImmuable, currentData, element, assign, loadingData, perPage, currentPage } = this.state;

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-2 flex flex-row">
						<Search onSearch={this.handleSearch} placeholder="Rechercher par uid, reference, adresse, code postal, ville, locataire, propriétaire.." />
					</div>

					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage}
										 onClick={this.handlePaginationClick}
										 onPerPage={this.handlePerPage}/>

					<BiensList data={currentData}
							   element={this.props.element}
							   isAssignation={isAssignation}
							   highlight={parseInt(highlight)}
							   onModal={this.handleModal}
							   onAssign={this.handleAssign} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />

					{isAssignation
						? createPortal(<Modal ref={this.confirmAssign} identifiant="confirmAssign" maxWidth={568}
											  title="Confirmer la récupération"
											  content={<p>Confirmer vous la récupération du dernier EDL UID
														  de <b>{assign ? assign.reference + " (" + assign.lastInventoryUid + ")" : ""}</b> vers
														  le bien <b>{this.props.element ? this.props.element.reference : ""}</b> ?</p>}
											  footer={<Button type="blue" onClick={this.handleAssign}>Confirmer</Button>} />
							, document.body)
						: createPortal(<Modal ref={this.lastInventory} identifiant="lastInventory" maxWidth={1280} margin={1}
											  title={`Assigner le dernier EDL à ${element ? element.reference : ""}`}
											  content={<Biens numSociety={numSociety}
															  donnees={JSON.stringify(dataImmuable)}
															  isAssignation={true}
															  element={element}  />}
											  footer={null} />
							, document.body)
					}
				</>
			}
		</>
	}
}
