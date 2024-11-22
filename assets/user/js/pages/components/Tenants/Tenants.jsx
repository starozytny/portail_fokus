import React, { Component } from "react";

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { TenantsList } from "@userPages/Tenants/TenantsList";

import { Search } from "@tailwindComponents/Elements/Search";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_GET_DATA = "intern_api_fokus_tenants_list";

const SESSION_PERPAGE = "project.perpage.fk_tenants";

export class Tenants extends Component {
	constructor (props) {
		super(props);
		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, 20),
			currentPage: 0,
			sorter: Sort.compareLastName,
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
		const { perPage, sorter } = this.state;

		List.getData(this, Routing.generate(URL_GET_DATA, {numSociety: numSociety}), perPage, sorter, highlight);
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
		const { highlight } = this.props;
		const { data, currentData, loadingData, perPage, currentPage } = this.state;

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-2 flex flex-row">
						<Search onSearch={this.handleSearch} placeholder="Rechercher par locataire, reference, adresse.." />
					</div>

					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage}
										 onClick={this.handlePaginationClick}
										 onPerPage={this.handlePerPage}/>

					<TenantsList data={currentData}
								 highlight={parseInt(highlight)}
								 onModal={this.handleModal} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />
				</>
			}
		</>
	}
}
