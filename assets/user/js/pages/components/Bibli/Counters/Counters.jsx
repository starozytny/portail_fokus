import React, { Component } from "react";
import { createPortal } from "react-dom";

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { CountersList } from "@userPages/Bibli/Counters/CountersList";
import { CounterFormulaire } from "@userPages/Bibli/Counters/CounterForm";

import { Modal } from "@tailwindComponents/Elements/Modal";
import { Button } from "@tailwindComponents/Elements/Button";
import { Search } from "@tailwindComponents/Elements/Search";
import { Filter } from "@tailwindComponents/Elements/Filter";
import { ModalDelete } from "@tailwindComponents/Shortcut/Modal";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_DELETE_ELEMENT = "intern_api_fokus_bibli_counters_delete";

const SESSION_PERPAGE = "project.perpage.fk_counters";
const SESSION_FILTERS = "project.filters.fk_counters";

export class Counters extends Component {
	constructor (props) {
		super(props);
		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, 20),
			currentPage: 0,
			sorter: Sort.compareName,
			filters: List.getSessionFilters(SESSION_FILTERS, [], props.highlight),
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
		const { donnees, highlight } = this.props;
		const { perPage, sorter, filters } = this.state;

		List.setData(this, donnees, perPage, sorter, highlight, filters, this.handleFilters);
	}

	handleUpdateData = (currentData) => {
		this.setState({ currentData })
	}

	handleSearch = (search) => {
		const { perPage, sorter, dataImmuable, filters } = this.state;
		List.search(this, 'name', search, dataImmuable, perPage, sorter, true, filters, this.handleFilters)
	}

	handleFilters = (filters, nData = null) => {
		const { dataImmuable, perPage, sorter } = this.state;
		return List.filter(this, 'bibli', nData ? nData : dataImmuable, filters, perPage, sorter, SESSION_FILTERS);
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
		const { pageId, highlight, rights } = this.props;
		const { data, currentData, element, loadingData, perPage, currentPage, filters } = this.state;

		let filtersItems = [
			{ value: 0, id: "f-0", label: "Natif" },
			{ value: 1, id: "f-1", label: "Utilisée" },
			{ value: 2, id: "f-2", label: "Libre" },
		]

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-2 flex flex-col gap-4 md:flex-row">
						{rights !== "2"
							? <div className="md:w-[258px]">
								<Button type="blue" iconLeft="add" width="w-full" onClick={() => this.handleModal('form', null)}>
									Ajouter un compteur
								</Button>
							</div>
							: null
						}
						<div className="w-full flex flex-row">
							<Filter haveSearch={true} filters={filters} items={filtersItems} onFilters={this.handleFilters} />
							<Search haveFilter={true} onSearch={this.handleSearch} placeholder="Rechercher pas intitulé.." />
						</div>
					</div>

					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage}
										 onClick={this.handlePaginationClick}
										 onPerPage={this.handlePerPage} />

					<CountersList data={currentData}
								  rights={rights}
								  highlight={parseInt(highlight)}
								  onModal={this.handleModal} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />

					{createPortal(<ModalDelete refModal={this.delete} element={element} routeName={URL_DELETE_ELEMENT}
											   title="Supprimer ce compteur" msgSuccess="Compteur supprimé."
											   onUpdateList={this.handleUpdateList}>
						Êtes-vous sûr de vouloir supprimer définitivement ce compteur : <b>{element ? element.name : ""}</b> ?
					</ModalDelete>, document.body)}

					{createPortal(<Modal ref={this.form} identifiant='form-counter' maxWidth={568}
										 title={element ? `Modifier ${element.name}` : "Ajouter un compteur"}
										 isForm={true}
										 content={<CounterFormulaire context={element ? "update" : "create"} element={element ? element : null}
																	 pageId={pageId} identifiant="form-counter" key={element ? element.id : 0} />}
					/>, document.body)}
				</>
			}
		</>
	}
}
