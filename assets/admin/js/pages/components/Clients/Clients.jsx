import React, { Component } from "react";

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { ClientsList } from "@adminPages/Clients/ClientsList";

import { Search } from "@tailwindComponents/Elements/Search";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_GET_DATA = "intern_api_administration_clients_list";

let sorters = [
	{ value: 0, label: 'Code', identifiant: 'sorter-code' },
	{ value: 1, label: 'Nom', identifiant: 'sorter-nom' },
]
let sortersFunction = [Sort.compareCode, Sort.compareName];

const SESSION_SORTER = "project.sorter.clients";
const SESSION_PERPAGE = "project.perpage.clients";

export class Clients extends Component {
	constructor (props) {
		super(props);

        let [sorter, nbSorter] = List.getSessionSorter(SESSION_SORTER, Sort.compareCode, sortersFunction)

		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, 20),
			currentPage: 0,
			sorter: sorter,
			nbSorter: nbSorter,
			loadingData: true,
			element: null
		}

		this.pagination = React.createRef();
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
		List.search(this, 'society', search, dataImmuable, perPage, sorter)
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

					<ClientsList data={currentData} highlight={parseInt(highlight)} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />
				</>
			}
		</>
	}
}
