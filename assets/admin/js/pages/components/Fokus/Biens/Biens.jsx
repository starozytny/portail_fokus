import React, { Component } from "react";
import { createPortal } from "react-dom";

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";

import { BiensList } from "@adminPages/Fokus/Biens/BiensList";

import { Modal } from "@tailwindComponents/Elements/Modal";
import { Search } from "@tailwindComponents/Elements/Search";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_GET_DATA = "intern_api_fokus_properties_list";

const SESSION_PERPAGE = "project.perpage.fk_biens";

export class Biens extends Component {
	constructor (props) {
		super(props);
		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, props.isAssignation ? 5 : 20),
			currentPage: 0,
			sorter: Sort.compareAddr1,
			loadingData: true,
			element: null
		}

		this.pagination = React.createRef();
		this.lastInventory = React.createRef();
	}

	componentDidMount = () => {
		this.handleGetData();
	}

	handleGetData = () => {
		const { clientId, highlight, donnees, isAssignation } = this.props;
		const { perPage, sorter } = this.state;

		if(isAssignation){
			List.setData(this, donnees, perPage, sorter, highlight);
		}else{
			List.getData(this, Routing.generate(URL_GET_DATA, {clientId: clientId}), perPage, sorter, highlight);
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

	handleModal = (identifiant, elem) => {
		this[identifiant].current.handleClick();
		this.setState({ element: elem })
	}

	render () {
		const { clientId, highlight, isAssignation } = this.props;
		const { data, dataImmuable, currentData, element, loadingData, perPage, currentPage } = this.state;

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-2 flex flex-row">
						<Search onSearch={this.handleSearch} placeholder="Rechercher par uid, reference, addresse, code postal, ville, locataire, propriétaire.." />
					</div>

					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage}
										 onClick={this.handlePaginationClick}
										 onPerPage={this.handlePerPage}/>

					<BiensList data={currentData} isAssignation={isAssignation} highlight={parseInt(highlight)}
							   onModal={this.handleModal} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />

					{isAssignation
						? null
						: createPortal(<Modal ref={this.lastInventory} identifiant="lastInventory" maxWidth={1280} margin={1}
											  title={`Assigner le dernier EDL à ${element ? element.reference : ""}`}
											  content={<Biens clientId={clientId} donnees={JSON.stringify(dataImmuable)} isAssignation={true} />}
											  footer={null} />
							, document.body)

					}
				</>
			}
		</>
	}
}
