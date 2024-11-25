import React, { Component } from "react";

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { RoomsList } from "@userPages/Bibli/Rooms/RoomsList";

import { Search } from "@tailwindComponents/Elements/Search";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";
import { Filter } from "@tailwindComponents/Elements/Filter";

const URL_GET_DATA = "intern_api_fokus_bibli_rooms_list";

const SESSION_PERPAGE = "project.perpage.fk_rooms";
const SESSION_FILTERS = "project.filters.fk_rooms";

export class Rooms extends Component {
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
	}

	componentDidMount = () => {
		this.handleGetData();
	}

	handleGetData = () => {
		const { numSociety, highlight } = this.props;
		const { perPage, sorter, filters } = this.state;

		List.getData(this, Routing.generate(URL_GET_DATA, {numSociety: numSociety}), perPage, sorter, highlight, filters, this.handleFilters);
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
		const { highlight } = this.props;
		const { data, currentData, loadingData, perPage, currentPage, filters } = this.state;

		let filtersItems = [
			{ value: 0, id: "f-0", label: "Natif" },
			{ value: 1, id: "f-1", label: "Utilisée" },
			{ value: 2, id: "f-2", label: "Libre" },
		]

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-2 flex flex-row">
						<Filter haveSearch={true} filters={filters} items={filtersItems} onFilters={this.handleFilters} />
						<Search haveFilter={true} onSearch={this.handleSearch} placeholder="Rechercher pas intitulé.." />
					</div>

					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage}
										 onClick={this.handlePaginationClick}
										 onPerPage={this.handlePerPage} />

					<RoomsList data={currentData}
							   highlight={parseInt(highlight)}
							   onModal={this.handleModal} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />
				</>
			}
		</>
	}
}
