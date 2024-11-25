import React, { Component } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sort from "@commonFunctions/sort";
import List from "@commonFunctions/list";
import Formulaire from "@commonFunctions/formulaire";

import { ModelsList } from "@userPages/Models/ModelsList";
import { ModelFormulaire } from "@userPages/Models/ModelForm";

import { Modal } from "@tailwindComponents/Elements/Modal";
import { Button } from "@tailwindComponents/Elements/Button";
import { Search } from "@tailwindComponents/Elements/Search";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";
import { Pagination, TopSorterPagination } from "@tailwindComponents/Elements/Pagination";

const URL_GET_DATA = "intern_api_fokus_models_list";

const SESSION_PERPAGE = "project.perpage.fk_models";

export class Models extends Component {
	constructor (props) {
		super(props);
		this.state = {
            perPage: List.getSessionPerpage(SESSION_PERPAGE, 20),
			currentPage: 0,
			sorter: Sort.compareName,
			loadingData: true,
			element: null,
			rooms: [],
			categories: [],
			elements: [],
			elementsNatures: [],
			natures: [],
		}

		this.pagination = React.createRef();
		this.details = React.createRef();
		this.form = React.createRef();
	}

	componentDidMount = () => {
		this.handleGetData();
	}

	handleGetData = () => {
		const { numSociety, highlight } = this.props;
		const { perPage, sorter } = this.state;

		const self = this;
		axios({ method: "GET", url: Routing.generate(URL_GET_DATA, {numSociety: numSociety}), data: {} })
			.then(function (response) {
				let data = JSON.parse(response.data.donnees);
				let dataImmuable = JSON.parse(response.data.donnees);

				data.sort(sorter);
				dataImmuable.sort(sorter);

				let [currentData, currentPage] = List.setCurrentPage(highlight, data, perPage);

				self.setState({
					data: data, dataImmuable: dataImmuable, currentData: currentData,
					rooms: JSON.parse(response.data.rooms),
					categories: JSON.parse(response.data.categories),
					elements: JSON.parse(response.data.elements),
					elementsNatures: JSON.parse(response.data.elementsNatures),
					natures: JSON.parse(response.data.natures),
					currentPage: currentPage,
					loadingData: false })
			})
			.catch(function (error) { Formulaire.displayErrors(self, error); })
		;
	}

	handleUpdateData = (currentData) => {
		this.setState({ currentData })
	}

	handleSearch = (search) => {
		const { perPage, sorter, dataImmuable } = this.state;
		List.search(this, 'name', search, dataImmuable, perPage, sorter)
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
		const { data, currentData, element, loadingData, perPage, currentPage, rooms, categories, elements, elementsNatures, natures } = this.state;

		let itemsElement = [];
		if(element){
			itemsElement = getDisplayDetails(element, rooms, categories, elements);
		}

		return <>
			{loadingData
				? <LoaderElements />
				: <>
					<div className="mb-2 flex flex-col gap-4 md:flex-row">
						<div className="md:w-[258px]">
							<Button type="blue" iconLeft="add" width="w-full" onClick={() => this.handleModal('form', null)}>
								Ajouter un modèle
							</Button>
						</div>
						<div className="w-full flex flex-row">
							<Search onSearch={this.handleSearch} placeholder="Rechercher par intitule.." />
						</div>
					</div>

					<TopSorterPagination taille={data.length} currentPage={currentPage} perPage={perPage}
										 onClick={this.handlePaginationClick}
										 onPerPage={this.handlePerPage} />

					<ModelsList data={currentData}
								highlight={parseInt(highlight)}
								onModal={this.handleModal} />

					<Pagination ref={this.pagination} items={data} taille={data.length} currentPage={currentPage}
								perPage={perPage} onUpdate={this.handleUpdateData} onChangeCurrentPage={this.handleChangeCurrentPage} />

					{createPortal(<Modal ref={this.details} identifiant='details-model' maxWidth={568} margin={1}
										 title={element ? `Détails de : ${element.name}` : ""}
										 content={<div className="flex flex-col gap-4">
											 {itemsElement}
										 </div>}
					/>, document.body)}

					{createPortal(<Modal ref={this.form} identifiant='form-model' maxWidth={768} margin={1}
										 title={element ? `Modifier ${element.name}` : "Ajouter un modèle"}
										 isForm={true}
										 content={<ModelFormulaire context={element ? "update" : "create"} element={element ? element : null}
																   rooms={rooms} categories={categories} elements={elements}
																   elementsNatures={elementsNatures} natures={natures}
																   identifiant="form-model" key={element ? element.id : 0} />}
					/>, document.body)}
				</>
			}
		</>
	}
}

function getDisplayDetails (element, rooms, categories, elements) {
	let itemsElement = [];
	let elementContent = JSON.parse(element.content);

	elementContent.forEach((elem, index) => {
		let elementName = "";
		rooms.forEach(r => {
			if(r.id === elem.id){
				elementName = r.name;
			}
		})

		let elementCat = [];
		categories.forEach(cat => {
			let catData = [];
			JSON.parse(elem.elements).forEach(elemId => {
				let itemElement = null;
				elements.forEach(el => {
					if(el.id === elemId){
						itemElement = el;
					}
				})

				if(itemElement.category === cat.id){
					catData.push(<div key={cat.id + "-" + itemElement.id}>- {itemElement.name}</div>)
				}
			})

			if(catData.length !== 0){
				elementCat.push({
					'id': cat.id,
					'name': cat.name,
					'data': catData
				});
			}
		})

		itemsElement.push(<div className="bg-white border rounded-md" key={index}>
			<div className="text-lg font-semibold border-b px-4 pt-2 pb-1 bg-color0 rounded-t-md text-white">{elementName}</div>
			<div className="p-4 flex gap-2">
				{elementCat.map(elCat => {
					return <div className="w-full" key={elCat.id}>
						<div className="font-medium">{elCat.name}</div>
						<div className="pl-2 text-gray-600">{elCat.data}</div>
					</div>
				})}
			</div>
		</div>)
	})

	return itemsElement;
}
