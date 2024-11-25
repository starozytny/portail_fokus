import React, { Component } from 'react';
import { createPortal } from "react-dom";

import axios from 'axios';
import { uid } from 'uid';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur"

import { Rooms } from "@userPages/Bibli/Rooms/Rooms";
import { getDisplayDetails } from "@userPages/Models/Models";

import { Input } from "@tailwindComponents/Elements/Fields";
import { Button, ButtonIcon } from "@tailwindComponents/Elements/Button";
import { CloseModalBtn, Modal } from "@tailwindComponents/Elements/Modal";

const URL_INDEX_ELEMENTS = "user_models_index";
const URL_CREATE_ELEMENT = "intern_api_fokus_bibli_aspects_create";
const URL_UPDATE_ELEMENT = "intern_api_fokus_bibli_aspects_update";

function getNameRoom (rooms, id){
	let name = "";
	rooms.forEach(room => {
		if(room.id === id){
			name = room.name;
		}
	})

	return name;
}

export function ModelFormulaire ({ context, element, identifiant, rooms, categories, elements }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_ELEMENT, { id: element.id });
	}

	return  <Form
        context={context}
        url={url}
        name={element ? Formulaire.setValue(element.name) : ""}
		content={element ? JSON.parse(element.content) : []}

		identifiant={identifiant}
		rooms={rooms}
		categories={categories}
		elements={elements}
    />
}

class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			name: props.name,
			content: props.content,
			errors: [],
		}

		this.room = React.createRef();
	}

	handleChange = (e) => { this.setState({ [e.currentTarget.name]: e.currentTarget.value }) }

	handleModal = (identifiant) => {
		this[identifiant].current.handleClick();
	}

	handleAddRoom = (roomId) => {
		const { content } = this.state;

		this.setState({ content: [...[{ uid: uid(), id: roomId, elements: '[3, 4, 5, 6, 7, 8, 16, 17, 18]' }], ...content] })
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { context, url } = this.props;
		const { name } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'name', value: name },
		];

		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			let self = this;
			Formulaire.loader(true);
			axios({ method: context === "create" ? "POST" : "PUT", url: url, data: this.state })
				.then(function (response) {
					location.href = Routing.generate(URL_INDEX_ELEMENTS, { h: response.data.id });
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { context, identifiant, rooms, categories, elements } = this.props;
		const { errors, name, content } = this.state;

		let params0 = { errors: errors, onChange: this.handleChange };

		return <>
			<div className="px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
				<div className="flex flex-col gap-4">
					<div>
						<Input valeur={name} identifiant="name" {...params0}>Intitulé</Input>
					</div>
					<div>
						<Button type="default" onClick={() => this.handleModal('room')}>Sélectionner une/des pièce.s</Button>
					</div>
					<div>
						{content.length !== 0
							? <div className="list my-4">
								<div className="list-table bg-white rounded-md shadow">
									<div className="items items-models-rooms">
										<div className="item item-header uppercase text-sm text-gray-600">
											<div className="item-content">
												<div className="item-infos">
													<div className="col-1">Pièces</div>
													<div className="col-2">Éléments</div>
													<div className="col-3 actions" />
												</div>
											</div>
										</div>

										{content.map((elem, index) => {

											let itemsElement = [];

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

											itemsElement.push(<div className="flex flex-col gap-2" key={index}>
												{elementCat.map(elCat => {
													return <div className="w-full" key={elCat.id}>
														<div className="font-medium">{elCat.name} <span className="text-xs">({elCat.data.length})</span></div>
														<div className="pl-2 text-gray-600">{elCat.data}</div>
													</div>
												})}
											</div>)

											return <div className="item border-t hover:bg-slate-50" key={index}>
												<div className="item-content">
													<div className="item-infos">
														<div className="col-1">
															{getNameRoom(rooms, elem.id)}
														</div>
														<div className="col-2">
															{itemsElement}
														</div>
														<div className="col-3 actions">
															<ButtonIcon type="default" icon="pencil">Modifier</ButtonIcon>
															<ButtonIcon type="default" icon="trash">Supprimer</ButtonIcon>
														</div>
													</div>
												</div>
											</div>
										})}
									</div>
								</div>
							</div>
							: null
						}
					</div>
				</div>
			</div>

			<div className="bg-gray-50 px-4 py-3 flex flex-row justify-end gap-2 sm:px-6 border-t rounded-b-lg">
				<CloseModalBtn identifiant={identifiant} />
				<Button type="blue" onClick={this.handleSubmit}>
					{context === "create" ? "Enregistrer" : "Enregistrer les modifications"}
				</Button>
			</div>

			{createPortal(<Modal ref={this.room} identifiant='model-room' maxWidth={568} margin={1} zIndex={41}
								 title="Sélectionner une/des pièce.s"
								 content={<Rooms donnees={JSON.stringify(rooms)} roomsSelected={content} onAddRoom={this.handleAddRoom} />}
			/>, document.body)}
		</>
	}
}
