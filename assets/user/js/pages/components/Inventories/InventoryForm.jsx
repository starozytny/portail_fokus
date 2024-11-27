import React, { Component } from 'react';
import { createPortal } from "react-dom";

import axios from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Button } from "@tailwindComponents/Elements/Button";
import { CloseModalBtn, Modal } from "@tailwindComponents/Elements/Modal";
import { Checkbox, Input, Radiobox, Select } from "@tailwindComponents/Elements/Fields";

import { Biens } from "@userPages/Biens/Biens";

const URL_INDEX_ELEMENTS = "user_properties_index";
const URL_CREATE_ELEMENT = "intern_api_fokus_properties_create";
const URL_UPDATE_ELEMENT = "intern_api_fokus_properties_update";

export function InventoryFormulaire ({ context, element, identifiant, properties, users, models, tenants }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	let comparativeValue = [0];
	if (context === "update") {
		url = Routing.generate(URL_UPDATE_ELEMENT, { id: element.id });

		switch (parseInt(element.comparative)){
			case 1: comparativeValue = [2]; break;
			case 2: comparativeValue = [0]; break;
			case 3: comparativeValue = [0,1]; break;
			case 4: comparativeValue = [0,1,2]; break;
			case 5: comparativeValue = [0,2]; break;
			case 6: comparativeValue = [1,2]; break;
			case 7: comparativeValue = [1]; break;
			default:break;
		}
	}

	return  <Form
        context={context}
        url={url}
		userId={element ? Formulaire.setValue(element.userId) : ""}
        input={element ? Formulaire.setValue(element.input) : 0}
        date={element ? Formulaire.setValue(element.date === 0 ? "" : element.date) : ""}
        type={element ? Formulaire.setValue(element.type) : ""}
        comparative={element ? comparativeValue : []}
        model={element ? Formulaire.setValue(element.model) : ""}
		property={element ? Formulaire.setValue(element.property) : null}
		propertyUid={element ? Formulaire.setValue(element.propertyUid) : ""}
        inventoryTenants={element ? Formulaire.setValue(element.tenants) : ""}

		identifiant={identifiant}
		properties={properties}
		users={users}
		models={models}
		tenants={tenants}
    />
}

class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			userId: props.userId,
			input: props.input,
			date: props.date,
			type: props.type,
			comparative: props.comparative,
			model: props.model,
			propertyUid: props.propertyUid,
			inventoryTenants: props.inventoryTenants,
			errors: []
		}

		this.property = React.createRef();
	}

	handleModal = (identifiant, elem) => {
		this[identifiant].current.handleClick();
		this.setState({ element: elem })
	}

	handleChange = (e) => {
		let name = e.currentTarget.name;
		let value = e.currentTarget.value;

		if (name === "comparative") {
			value = Formulaire.updateValueCheckbox(e, this.state[name], parseInt(value));
		}

		this.setState({ [name]: value })
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { context, url } = this.props;
		const { userId, input, type } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'userId', value: userId },
			{ type: "text", id: 'input', value: input },
			{ type: "text", id: 'type', value: type },
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
		const { context, identifiant, users, models, properties } = this.props;
		const { errors, userId, input, date, type, comparative, model, property, propertyUid, tenants } = this.state;

		let usersItems = [];
		users.forEach(us => {
			usersItems.push({ value: us.id, label: us.lastName + " " + us.firstName, identifiant: 'user-' + us.id })
		});

		let modelsItems = [];
		models.forEach(mo => {
			modelsItems.push({ value: "-" + mo.id, label: mo.name, identifiant: 'model-' + mo.id })
		});

		let inputItems = [{ value: 0, label: 'EDL Vierge', identifiant: 'edl-vierge' }]
		if (models.length > 0) {
			inputItems = [...inputItems, { value: 1, label: 'Établir structure', identifiant: 'etablir-structure' }]
		}
		if (property && property.lastInventoryUid && property.lastInventoryUid !== "" && property.lastInventoryUid !== "0") {
			inputItems = [...inputItems, { value: 2, label: 'EDL Précédent', identifiant: 'edl-precedent' }]
		}

		let typeItems = [
			{ value: 1, identifiant: 'entrant', label: 'Entrant' },
			{ value: 0, identifiant: 'sortant', label: 'Sortant' }
		]

		let comparativeItems = [
			{ value: 0, identifiant: 'compa-0', label: 'Conserver commentaires' },
			{ value: 1, identifiant: 'compa-1', label: 'Conserver photos' },
			{ value: 2, identifiant: 'compa-2', label: 'Comparatif' }
		]

		let params0 = { errors: errors, onChange: this.handleChange };

		return <>
			<div className="px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
				<div className="flex flex-col gap-4">
					<div>
						<Button type="default" onClick={() => this.handleModal('property')}>Sélectionner un bien</Button>
					</div>
					<div className="flex gap-4">
						<div className="w-full">
							<Select identifiant="userId" valeur={userId} items={usersItems} {...params0}>
								Attribution
							</Select>
						</div>
						<div className="w-full">
							<Select identifiant="input" valeur={input} items={inputItems} {...params0}>
								Structure
							</Select>
						</div>
					</div>
					{parseInt(input) === 1
						? <div className="flex gap-4">
							<div className="w-full"></div>
							<div className="w-full">
								<Select identifiant="model" valeur={model} items={modelsItems} {...params0}>
									Modèle
								</Select>
							</div>
						</div>
						: null
					}
					{parseInt(input) === 2
						? <div>
							<Checkbox identifiant="comparative" valeur={comparative} items={comparativeItems} {...params0}
									  styleType="fat" classItems="flex gap-2">
								Options de la structure
							</Checkbox>
						</div>
						: null
					}
					<div className="flex gap-4">
						<div className="w-full">
							<Radiobox identifiant="type" valeur={type} items={typeItems} {...params0}
									  styleType="fat" classItems="flex gap-2">
								Type d'état des lieux
							</Radiobox>
						</div>
						<div className="w-full">
							<Input type="datetime-local" identifiant="date" valeur={date} {...params0}>
								Prévu le <span className="text-xs">(facultatif)</span>
							</Input>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-gray-50 px-4 py-3 flex flex-row justify-end gap-2 sm:px-6 border-t rounded-b-lg">
				<CloseModalBtn identifiant={identifiant} />
				<Button type="blue" onClick={this.handleSubmit}>
					{context === "create" ? "Enregistrer" : "Enregistrer les modifications"}
				</Button>
			</div>

			{createPortal(<Modal ref={this.property} identifiant='inventory-property' maxWidth={1280} margin={2} zIndex={41} bgColor="bg-gray-100"
								 title="Sélectionner un bien"
								 content={<Biens donnees={JSON.stringify(properties)}
												 propertiesSelected={propertyUid !== "" ? [propertyUid] : []}
												 onSelector={true} />}
			/>, document.body)}
		</>
	}
}
