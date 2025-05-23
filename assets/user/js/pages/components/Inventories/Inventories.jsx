import React, { Component } from "react";
import { createPortal } from "react-dom";

import axios from "axios";
import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
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
import Toastr from "@tailwindFunctions/toastr";

const URL_INDEX_ELEMENTS = "user_inventories_index";
const URL_GET_DATA = "intern_api_fokus_inventories_list";
const URL_DELETE_ELEMENT = "intern_api_fokus_inventories_delete";
const URL_AI_COMPARATIVE_READ_FILE = "intern_api_fokus_inventories_ai_comparator_read_file";
const URL_AI_COMPARATIVE_DOWNLOAD_FILE = "intern_api_fokus_inventories_ai_comparator_download_file";
const URL_AI_COMPARATIVE_PICTURE = "intern_api_fokus_inventories_ai_comparator_pictures";
const URL_AI_COMPARATIVE_RUN = "intern_api_fokus_inventories_ai_comparator_run";
const URL_AI_EXTRACTOR_RUN = "intern_api_fokus_inventories_ai_extractor_run";

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
				this.handleModal('form', null, null, true);
			}, 500)
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

	handleModal = (identifiant, elem, retry = false) => {
		if(retry && !this[identifiant].current){
			setTimeout(() => {
				this.handleModal(identifiant, elem, true);
			}, 500)
		}else{
			if(identifiant === "form") {
				Formulaire.loader(false);
			}

			this[identifiant].current.handleClick();
			this.setState({ element: elem })

			if(identifiant === "aiCompare"){
				this[identifiant].current.handleUpdateContent(<LoaderElements />);

				let self = this;
				Formulaire.loader(true);
				axios({ method: "POST", url: Routing.generate(URL_AI_COMPARATIVE_READ_FILE, { uidOut: elem.uid }), data: {} })
					.then(function (response) {
						self[identifiant].current.handleUpdateFooter(<>
							<ButtonA type="default" onClick={Routing.generate(URL_AI_COMPARATIVE_PICTURE, { uidOut: elem.uid })} target="_blank">Photos du comparatif</ButtonA>
							<ButtonA type="default" onClick={Routing.generate(URL_AI_COMPARATIVE_DOWNLOAD_FILE, { uidOut: elem.uid })} target="_blank">Télécharger le fichier</ButtonA>
							<Button type="blue" onClick={() => self.handleAiCompare(identifiant, elem)}>Relancer la comparaison IA</Button>
						</>)
						if(response.data.answer){
							self[identifiant].current.handleUpdateContent(<>
								<div className="mb-2">
									<Button type="default" iconLeft="copy" onClick={() => self.handleCopyToClipboard(response.data.answer)}>Copier dans le texte</Button>
								</div>
								<div className="bg-gray-50 p-4 border rounded-md">
									<div className="prose" style={{ width: "100%", maxWidth: "100%" }}>
										<ReactMarkdown rehypePlugins={[rehypeRaw]}>{response.data.answer}</ReactMarkdown>
									</div>
								</div>
							</>);
							Formulaire.loader(false);
						}else{
							self.handleAiCompare(identifiant, elem)
						}
					})
					.catch(function (error) {
						Formulaire.displayErrors(self, error);
						Formulaire.loader(false);
					})
				;
			}
		}
	}

	handleCopyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		Toastr.toast('info', 'Texte copié dans le presse papier.')
	}

	handleAiCompare = (identifiant, elem) => {

		let url = elem.type === 0 && !elem.uidEntryForAi
			? Routing.generate(URL_AI_EXTRACTOR_RUN, { uidOut: elem.uid })
			: Routing.generate(URL_AI_COMPARATIVE_RUN, { uidEntry: elem.uidEntryForAi, uidOut: elem.uid })

		let self = this;
		Formulaire.loader(true);
		axios({ method: "POST", url: url, data: {} })
			.then(function (response) {
				self[identifiant].current.handleUpdateFooter(<>
					<ButtonA type="default" onClick={Routing.generate(URL_AI_COMPARATIVE_PICTURE, { uidOut: elem.uid })} target="_blank">Photos du comparatif</ButtonA>
					<ButtonA type="default" onClick={Routing.generate(URL_AI_COMPARATIVE_DOWNLOAD_FILE, { uidOut: elem.uid })} target="_blank">Télécharger le fichier</ButtonA>
					<Button type="blue" onClick={() => self.handleAiCompare(identifiant, elem)}>Relancer la comparaison IA</Button>
				</>)

				if(response.data.answer){
					self[identifiant].current.handleUpdateContent(<>
						<div className="mb-2">
							<Button type="default" onClick={() => self.handleCopyToClipboard(response.data.answer)}>Copier dans le texte</Button>
						</div>
						<div className="bg-gray-50 p-4 border rounded-md">
							<div className="prose" style={{ width: "100%", maxWidth: "100%" }}>
								<ReactMarkdown rehypePlugins={[rehypeRaw]}>{response.data.answer}</ReactMarkdown>
							</div>
						</div>
					</>);
				}else{
					self[identifiant].current.handleUpdateContent(<div className="text-red-500">Erreur durant la génération de la réponse AI.</div>);
				}
			})
			.catch(function (error) {
				Formulaire.displayErrors(self, error);
			})
			.then(function () {
				Formulaire.loader(false);
			})
		;
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

					{createPortal(<Modal ref={this.aiCompare} identifiant='ai-compare' maxWidth={1024} margin={1}
										 title={element ? `Comparateur par IA de ${element.uid}` : ""}
										 content={null}
					/>, document.body)}
				</>
			}
		</>
	}
}
