import React, { Component } from 'react';

import axios from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Input } from "@tailwindComponents/Elements/Fields";
import { Button } from "@tailwindComponents/Elements/Button";
import { CloseModalBtn } from "@tailwindComponents/Elements/Modal";

const URL_INDEX_ELEMENTS = "user_bibli_index";
const URL_CREATE_ELEMENT = "intern_api_fokus_bibli_rooms_create";
const URL_UPDATE_ELEMENT = "intern_api_fokus_bibli_rooms_update";

export function RoomFormulaire ({ context, element, identifiant }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_ELEMENT, { id: element.id });
	}

	return  <Form
        context={context}
        url={url}
        name={element ? Formulaire.setValue(element.name) : ""}

		identifiant={identifiant}
    />
}

class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			name: props.name,
			errors: [],
		}
	}

	handleChange = (e) => { this.setState({ [e.currentTarget.name]: e.currentTarget.value }) }

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
		const { context, identifiant } = this.props;
		const { errors, name } = this.state;

		let params0 = { errors: errors, onChange: this.handleChange };

		return <>
			<div className="px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-4 xl:flex-row">
						<div className="w-full">
							<Input valeur={name} identifiant="name" {...params0}>Intitulé</Input>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-gray-50 px-4 py-3 flex flex-row justify-end gap-2 sm:px-6 border-t">
				<CloseModalBtn identifiant={identifiant} />
				<Button type="blue" onClick={this.handleSubmit}>
					{context === "create" ? "Enregistrer" : "Enregistrer les modifications"}
				</Button>
			</div>
		</>
	}
}
