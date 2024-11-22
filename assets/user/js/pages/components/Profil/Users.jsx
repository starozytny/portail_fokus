import React, { Component } from "react";
import { createPortal } from "react-dom";

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { UsersList } from "@userPages/Profil/UsersList";

import { Button } from "@tailwindComponents/Elements/Button";
import { Search } from "@tailwindComponents/Elements/Search";
import { Filter } from "@tailwindComponents/Elements/Filter";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";
import { Alert } from "@tailwindComponents/Elements/Alert";
import { Input } from "@tailwindComponents/Elements/Fields";
import { Modal } from "@tailwindComponents/Elements/Modal";
import { ProfilFormulaire } from "@userPages/Profil/ProfilForm";

const URL_GET_DATA = "intern_api_fokus_users_list";

let sorters = [
	{ value: 0, identifiant: 'sorter-nom', label: 'Nom' },
	{ value: 1, identifiant: 'sorter-ema', label: 'Email' },
]
let sortersFunction = [Sort.compareLastName, Sort.compareEmail];

const SESSION_SORTER = "project.sorter.fk_users";
const SESSION_PERPAGE = "project.perpage.fk_users";
const SESSION_FILTERS = "project.filters.fk_users";

export class Users extends Component {
	constructor (props) {
		super(props);

        let [sorter, nbSorter] = List.getSessionSorter(SESSION_SORTER, Sort.compareLastName, sortersFunction)

		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, 20),
			currentPage: 0,
			sorter: sorter,
			nbSorter: nbSorter,
			loadingData: true,
            filters: List.getSessionFilters(SESSION_FILTERS, [], props.highlight),
			element: null
		}

		this.pagination = React.createRef();
		this.form = React.createRef();
	}

	componentDidMount = () => {
		this.handleGetData();
	}

	handleGetData = () => {
		const { perPage, sorter, filters } = this.state;

		List.getData(this, Routing.generate(URL_GET_DATA), perPage, sorter, this.props.highlight, filters, this.handleFilters);
	}

	handleUpdateData = (currentData) => {
		this.setState({ currentData })
	}

	handleSearch = (search) => {
		const { perPage, sorter, dataImmuable, filters } = this.state;
		List.search(this, 'fokus_user', search, dataImmuable, perPage, sorter, true, filters, this.handleFilters)
	}

	handleFilters = (filters, nData = null) => {
		const { dataImmuable, perPage, sorter } = this.state;
		return List.filter(this, 'rights', nData ? nData : dataImmuable, filters, perPage, sorter, SESSION_FILTERS);
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
		this.setState({ element: elem });
		this[identifiant].current.handleClick();
	}

	render () {
		const { highlight } = this.props;
		const { data, currentData, element, loadingData, perPage, currentPage, filters, nbSorter } = this.state;

		let filtersItems = [
			{ value: 0, label: "Utilisateur", id: "f-user" },
			{ value: 1, label: "Administrateur", id: "f-admin" },
			{ value: 2, label: "Restreint", id: "f-restreint" },
		]

		return <>
			<div className="flex flex-col gap-4 mb-4 border-b pb-4 md:flex-row md:justify-between">
				<div className="text-xl font-semibold">
					Liste des utilisateurs
				</div>
				<div>
					<Button type="blue" iconLeft="add" onClick={() => this.handleModal('form', null)}>
						Ajouter un utilisateur
					</Button>
				</div>
			</div>
			{loadingData
				? <LoaderElements />
				: <>
					<div>
						<div className="mb-2 flex flex-row">
							<Filter haveSearch={true} filters={filters} items={filtersItems} onFilters={this.handleFilters} />
							<Search haveFilter={true} onSearch={this.handleSearch} placeholder="Rechercher pas identifiant, nom ou prénom.." />
						</div>

						<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage} sorters={sorters}
											 onClick={this.handlePaginationClick} nbSorter={nbSorter}
											 onPerPage={this.handlePerPage} onSorter={this.handleSorter} />

						<UsersList data={currentData} highlight={parseInt(highlight)} onModal={this.handleModal} />

						<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
									perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />
					</div>

					{createPortal(<Modal ref={this.form} identifiant='form-user' maxWidth={568} margin={1}
										 title={element ? `Modifier ${element.username}` : "Ajouter un utilisateur"}
										 isForm={true}
										 content={<ProfilFormulaire context={element ? "update" : "create"} element={element ? JSON.stringify(element) : null}
																	withModal={true} identifiant="form-user" />}
					/>, document.body)}
				</>
			}
		</>
	}
}
