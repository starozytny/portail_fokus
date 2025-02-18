import React, { Component } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";
import Formulaire from "@commonFunctions/formulaire";
import InventoriesFunctions from "@userFunctions/inventories";

import { InventoriesList } from "@userPages/Inventories/InventoriesList";
import { InventoryFormulaire } from "@userPages/Inventories/InventoryForm";
import { InventoryDetails } from "@userPages/Inventories/InventoryDetails";

import { Modal } from "@tailwindComponents/Elements/Modal";
import { Search } from "@tailwindComponents/Elements/Search";
import { ModalDelete } from "@tailwindComponents/Shortcut/Modal";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Button, ButtonA } from "@tailwindComponents/Elements/Button";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_INDEX_ELEMENTS = "user_inventories_index";
const URL_GET_DATA = "intern_api_fokus_inventories_list";
const URL_DELETE_ELEMENT = "intern_api_fokus_inventories_delete";
const URL_AI_COMPARATIVE = "intern_api_fokus_inventories_ai_comparator";

const SESSION_PERPAGE = "project.perpage.fk_inventories";

export class Inventories extends Component {
	constructor (props) {
		super(props);
		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, 20),
			currentPage: 0,
			sorter: Sort.compareDateInverse,
			loadingData: true,
			element: null,
			properties: [],
			users: [],
			tenants: [],
			models: [],
			hasAi: false
		}

		this.pagination = React.createRef();
		this.delete = React.createRef();
		this.form = React.createRef();
		this.details = React.createRef();
		this.aiCompare = React.createRef();
	}

	componentDidMount = () => {
		const { addContext } = this.props;

		this.handleGetData();
		if(addContext === "1"){
			Formulaire.loader(true);
			setTimeout(() => {
				if(this.form && this.form.current){
					this.handleModal('form', null);
					Formulaire.loader(false);
				}
			}, 1000)
		}
	}

	handleGetData = () => {
		const { numSociety, status, highlight } = this.props;
		const { perPage, sorter } = this.state;

		InventoriesFunctions.getData(this, Routing.generate(URL_GET_DATA, {st: status, numSociety: numSociety}), perPage, sorter, highlight);
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

	handleModal = (identifiant, elem, assign) => {
		this[identifiant].current.handleClick();
		this.setState({ element: elem, assign: assign })

		if(identifiant === "aiCompare"){
			this[identifiant].current.handleUpdateContent(<LoaderElements />);

			let self = this;
			Formulaire.loader(true);
			axios({ method: "POST", url: Routing.generate(URL_AI_COMPARATIVE, { uidEntry: elem.uidEntryForAi, uidOut: elem.uid }), data: {} })
				.then(function (response) {
					console.log(response.data);
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
				})
				.then(function () {
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { highlight, status, userId, rights } = this.props;
		const { data, currentData, element, loadingData, perPage, currentPage, properties, users, tenants, models, hasAi } = this.state;

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-4">
						<div className="text-xl font-semibold mb-2">États des lieux : </div>
						<div className="flex gap-2">
							<ButtonA type={status !== "2" ? "color3" : "default"} onClick={Routing.generate(URL_INDEX_ELEMENTS, { st: 0 })}>
								En cours
							</ButtonA>
							<ButtonA type={status === "2" ? "color3" : "default"} onClick={Routing.generate(URL_INDEX_ELEMENTS, { st: 2 })}>
								Terminés
							</ButtonA>
						</div>
					</div>

					<div className="mb-2 flex flex-col gap-4 md:flex-row">
						<div className="md:w-[258px]">
							<Button type="blue" iconLeft="add" width="w-full" onClick={() => this.handleModal('form', null)}>
								Ajouter un <span className="lg:hidden">EDL</span> <span className="hidden lg:inline">état des lieux</span>
							</Button>
						</div>
						<div className="w-full flex flex-row">
							<Search onSearch={this.handleSearch} placeholder="Rechercher par reference, adresse, code postal, ville, locataire, propriétaire.." />
						</div>
					</div>

					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage}
										 onClick={this.handlePaginationClick}
										 onPerPage={this.handlePerPage} />

					<InventoriesList data={currentData}
									 highlight={parseInt(highlight)}
									 onModal={this.handleModal}
									 hasAi={status === "2" && hasAi} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />

					{createPortal(<ModalDelete refModal={this.delete} element={element} routeName={URL_DELETE_ELEMENT}
											   title="Supprimer cet état des lieux" msgSuccess="État des lieux supprimé."
											   onUpdateList={this.handleUpdateList}>
						Êtes-vous sûr de vouloir supprimer définitivement cet état des lieux : <b>{element ? element.id : ""}</b> ?
					</ModalDelete>, document.body)}

					{createPortal(<Modal ref={this.form} identifiant='form-edl' maxWidth={568} margin={5}
										 title={element ? `Modifier ${element.id}` : "Ajouter un état des lieux"}
										 isForm={true}
										 content={<InventoryFormulaire context={element ? "update" : "create"} element={element ? element : null}
																	   userId={parseInt(userId)} rights={rights}
																	   properties={properties} users={users} tenants={tenants} models={models}
																	   identifiant="form-edl" key={element ? element.id : 0} />}
					/>, document.body)}

					{createPortal(<Modal ref={this.details} identifiant='details-edl' maxWidth={1024} margin={5}
										 title={element ? `Détails de ${element.uid}` : ""}
										 content={element ? <InventoryDetails elem={element} key={element.id} /> : null}
					/>, document.body)}

					{createPortal(<Modal ref={this.aiCompare} identifiant='ai-compare' maxWidth={1024} margin={5}
										 title={element ? `Comparateur par IA de ${element.uid}` : ""}
										 content={null}
					/>, document.body)}
				</>
			}
		</>
	}
}
