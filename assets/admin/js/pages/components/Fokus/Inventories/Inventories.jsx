import React, { Component } from "react";
import { createPortal } from "react-dom";

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";
import InventoriesFunctions from "@userFunctions/inventories";

import { InventoriesList } from "@userPages/Inventories/InventoriesList";
import { InventoryDetails } from "@userPages/Inventories/InventoryDetails";

import { Modal } from "@tailwindComponents/Elements/Modal";
import { Search } from "@tailwindComponents/Elements/Search";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Button, ButtonA } from "@tailwindComponents/Elements/Button";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_INDEX_ELEMENTS = "admin_fokus_inventories_list";
const URL_GET_DATA = "intern_api_fokus_inventories_list";

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
		}

		this.pagination = React.createRef();
		this.details = React.createRef();
	}

	componentDidMount = () => {
		this.handleGetData();
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
	}

	render () {
		const { numSociety, highlight, status } = this.props;
		const { data, currentData, element, loadingData, perPage, currentPage } = this.state;

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-4">
						<div className="text-xl font-semibold mb-2">États des lieux : </div>
						<div className="flex gap-2">
							<ButtonA type={status !== "2" ? "color3" : "default"} onClick={Routing.generate(URL_INDEX_ELEMENTS, { st: 0, numSociety: numSociety })}>
								En cours
							</ButtonA>
							<ButtonA type={status === "2" ? "color3" : "default"} onClick={Routing.generate(URL_INDEX_ELEMENTS, { st: 2, numSociety: numSociety })}>
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
									 onModal={this.handleModal} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />

					{createPortal(<Modal ref={this.details} identifiant='details-edl' maxWidth={1024} margin={5}
										 title={element ? `Détails de ${element.uid}` : ""}
										 content={element ? <InventoryDetails elem={element} key={element.id} /> : null}
					/>, document.body)}
				</>
			}
		</>
	}
}
