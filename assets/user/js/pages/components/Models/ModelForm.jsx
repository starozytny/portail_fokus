import React, { Component } from 'react';
import { createPortal } from "react-dom";

import axios from 'axios';
import { uid } from 'uid';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur"

import { Rooms } from "@userPages/Bibli/Rooms/Rooms";

import { Input } from "@tailwindComponents/Elements/Fields";
import { Button } from "@tailwindComponents/Elements/Button";
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

export function ModelFormulaire ({ context, element, identifiant, rooms }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	let content = [];
	if (context === "update") {
		url = Routing.generate(URL_UPDATE_ELEMENT, { id: element.id });

		JSON.parse(element.content).forEach(item => {
			content.push({
				uid: uid(),
				id: item.id,
				name: getNameRoom(rooms, item.id),
				elements: item.elements
			})
		})
	}

	return  <Form
        context={context}
        url={url}
        name={element ? Formulaire.setValue(element.name) : ""}
		content={content}

		identifiant={identifiant}
		rooms={rooms}
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
		const { rooms } = this.props;
		const { content } = this.state;

		let nContent = content;
		nContent.push({ uid: uid(), id: roomId, name: getNameRoom(rooms, roomId), elements: '[3, 4, 5, 6, 7, 8, 16, 17, 18]' });
		this.setState({ content: nContent })
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
		const { context, identifiant, rooms } = this.props;
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
