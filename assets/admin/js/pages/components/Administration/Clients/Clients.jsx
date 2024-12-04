import React, { Component } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";
import Toastr from "@tailwindFunctions/toastr";
import Formulaire from "@commonFunctions/formulaire";

import { ClientsList } from "@adminPages/Administration/Clients/ClientsList";

import { Modal } from "@tailwindComponents/Elements/Modal";
import { Button } from "@tailwindComponents/Elements/Button";
import { Search } from "@tailwindComponents/Elements/Search";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_INDEX_ELEMENTS = "admin_administration_clients_index";
const URL_GET_DATA = "intern_api_administration_clients_list";
const URL_ACTIVATE_ELEMENT = "intern_api_administration_clients_activate";

let sorters = [
	{ value: 0, label: 'Code', identifiant: 'sorter-code' },
	{ value: 1, label: 'Nom', identifiant: 'sorter-nom' },
]
let sortersFunction = [Sort.compareNumSociety, Sort.compareName];

const SESSION_SORTER = "project.sorter.ad_clients";
const SESSION_PERPAGE = "project.perpage.ad_clients";

export class Clients extends Component {
	constructor (props) {
		super(props);

        let [sorter, nbSorter] = List.getSessionSorter(SESSION_SORTER, Sort.compareNumSociety, sortersFunction)

		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, 20),
			currentPage: 0,
			sorter: sorter,
			nbSorter: nbSorter,
			loadingData: true,
			element: null
		}

		this.pagination = React.createRef();
		this.activate = React.createRef();
	}

	componentDidMount = () => {
		this.handleGetData();
	}

	handleGetData = () => {
		const { highlight } = this.props;
		const { perPage, sorter, filters } = this.state;

		List.getData(this, Routing.generate(URL_GET_DATA), perPage, sorter, highlight, filters, this.handleFilters);
	}

	handleUpdateData = (currentData) => {
		this.setState({ currentData })
	}

	handleSearch = (search) => {
		const { perPage, sorter, dataImmuable } = this.state;
		List.search(this, 'administration_clients', search, dataImmuable, perPage, sorter)
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

	handleSorter = (nb) => {
		List.changeSorter(this, this.state.data, this.state.perPage, sortersFunction, nb, SESSION_SORTER);
	}

	handleModal = (identifiant, elem) => {
		this[identifiant].current.handleClick();
		this.setState({ element: elem });
	}

	handleActivate = () => {
		const { element } = this.state;

		const self = this;
		Formulaire.loader(true);
		axios({ method: "POST", url: Routing.generate(URL_ACTIVATE_ELEMENT, { id: element.id }), data: {} })
			.then(function (response) {
				Toastr.toast('info', 'Société activée !');
				location.href = Routing.generate(URL_INDEX_ELEMENTS, { h: element.id });
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
				Formulaire.loader(false);
			})
		;
	}

	render () {
		const { highlight } = this.props;
		const { data, currentData, element, loadingData, perPage, currentPage, nbSorter } = this.state;

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-2">
                        <Search onSearch={this.handleSearch} placeholder="Rechercher par nom ou code.." />
					</div>

					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage} sorters={sorters}
										 onClick={this.handlePaginationClick} nbSorter={nbSorter}
										 onPerPage={this.handlePerPage} onSorter={this.handleSorter} />

					<ClientsList data={currentData} highlight={parseInt(highlight)} onModal={this.handleModal} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />

					{createPortal(
						<Modal ref={this.activate} identifiant="activate-society" maxWidth={568}
							   title="Activer la société"
							   content={<p>
								   Êtes-vous sûr de vouloir activer la société <b>{element ? element.name : null}</b> ?
								   <br/><br/>
								   L'activation permet d'activer la société pour ce portail.
								</p>}
							   footer={<Button type="blue" onClick={this.handleActivate}>Confirmer</Button>} />,
						document.body
					)}
				</>
			}
		</>
	}
}
