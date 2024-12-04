import React, { Component } from 'react';
import { createPortal } from "react-dom";

import axios from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import moment from "moment";
import 'moment/locale/fr';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Button } from "@tailwindComponents/Elements/Button";
import { CloseModalBtn, Modal } from "@tailwindComponents/Elements/Modal";
import { Checkbox, ErrorContent, Input, InputView, Radiobox, Select } from "@tailwindComponents/Elements/Fields";

import { Properties } from "@userPages/Properties/Properties";
import { Tenants } from "@userPages/Tenants/Tenants";

const URL_INDEX_ELEMENTS = "user_inventories_index";
const URL_CREATE_ELEMENT = "intern_api_fokus_inventories_create";
const URL_UPDATE_ELEMENT = "intern_api_fokus_inventories_update";

export function InventoryFormulaire ({ context, element, rights, identifiant, userId, dateClicked, properties, users, models, tenants }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	let inventoryTenants = [];
	let comparativeValue = [0];
	let date = dateClicked ? dateClicked : "";
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

		if(element.tenants){
			JSON.parse(element.tenants).forEach(teRef => {
				tenants.forEach(te => {
					if(te.reference === teRef){
						inventoryTenants.push(te);
					}
				})
			})
		}

		let timestamp = Formulaire.setValue(element.date === 0 ? "" : element.date);
		if(timestamp !== ""){
			date = moment(timestamp * 1000).format('YYYY-MM-DDTHH:mm');
		}
	}

	return  <Form
        context={context}
        url={url}
		userId={element ? Formulaire.setValue(element.userId) : userId}
        input={element ? Formulaire.setValue(element.input) : 0}
        date={date}
        type={element ? Formulaire.setValue(element.type) : ""}
        comparative={element ? comparativeValue : []}
        model={element ? Formulaire.setValue(element.model) : ""}
		property={element ? Formulaire.setValue(element.property) : null}
        inventoryTenants={inventoryTenants}

		identifiant={identifiant}
		properties={properties}
		users={users}
		models={models}
		tenants={tenants}

		rights={rights}
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
			property: props.property,
			tenants: props.inventoryTenants,
			errors: []
		}

		this.property = React.createRef();
		this.tenants = React.createRef();
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

	handleSelectProperty = (property) => {
		this.setState({ property: this.state.property === null || this.state.property.id !== property.id ? property : null });
		if(this.property.current){
			this.property.current.handleClose();
		}
	}

	handleSelectTenant = (tenant) => {
		const { tenants } = this.state;

		let find = false;
		tenants.forEach(te => {
			if(te.id === tenant.id){
				find = true;
			}
		})

		let nTenants = tenants;
		if(find){
			nTenants = tenants.filter(v => { return v.id !== tenant.id });
		}else{
			nTenants.push(tenant);
		}

		this.setState({ tenants: nTenants });
		if(this.tenants.current){
			this.tenants.current.handleClose();
		}
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { context, url } = this.props;
		const { userId, input, type, property, tenants } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'userId', value: userId },
			{ type: "text", id: 'input', value: input },
			{ type: "text", id: 'type', value: type },
			{ type: "text", id: 'property', value: property },
			{ type: "array", id: 'tenants', value: tenants },
		];

		let validate = Validateur.validateur(paramsToValidate);
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
		const { context, rights, identifiant, users, models, properties } = this.props;
		const { errors, userId, input, date, type, comparative, model, property, tenants } = this.state;

		let userName = userId;
		let usersItems = [];
		users.forEach(us => {
			usersItems.push({ value: us.id, label: us.lastName + " " + us.firstName, identifiant: 'user-' + us.id });

			if(userId !== "" && us.id === parseInt(userId)){
				userName = us.lastName + " " + us.firstName;
			}
		});

		let modelsItems = [];
		models.forEach(mo => {
			modelsItems.push({ value: "-" + mo.id, label: mo.name, identifiant: 'model-' + mo.id })
		});

		let inputItems = [{ value: 0, label: 'EDL Vierge', identifiant: 'edl-vierge' }]
		if (models.length > 0) {
			inputItems = [...inputItems, { value: 1, label: 'Établir structure', identifiant: 'etablir-structure' }]
		}
		if (property && property.lastInventoryUid && property.lastInventoryUid !== "" && property.lastInventoryUid !== 0) {
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

		let errorProperty, errorTenants;
		if (errors && errors.length !== 0) {
			errors.map(err => {
				if (err.name === "property") {
					errorProperty = err.message
				}
				if (err.name === "tenants") {
					errorTenants = err.message
				}
			})
		}

		return <>
			<div className="px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
				<div className="flex flex-col gap-4">
					<div>
						<label className="block text-sm font-medium leading-6 text-gray-800">Bien</label>
						{property
							? <div className="flex">
								<div className="w-full relative border-2 border-blue-500 rounded-md p-2 bg-blue-50 text-sm">
									<div><u>Référence</u> : <span className="font-medium">{property.reference}</span></div>
									<div>
										<div>{property.addr1}</div>
										<div>{property.addr2}</div>
										<div>{property.addr3}</div>
										<div>{property.zipcode} {property.city}</div>
									</div>
								</div>
								<div className="min-w-[68px] group cursor-pointer hover:border-red-300 hover:bg-red-50 border-2 pl-8 pr-4 flex items-center justify-center rounded-r-md -ml-4"
									 onClick={() => this.handleSelectProperty(property)}>
									<span className="icon-cancel group-hover:text-red-500 !font-medium"></span>
								</div>
							</div>
							: <div>
								<Button type="default" onClick={() => this.handleModal('property')}>Sélectionner un bien</Button>
							</div>
						}
						{errorProperty ? <ErrorContent error={errorProperty} /> : null }
					</div>
					<div>
						<label className="block text-sm font-medium leading-6 text-gray-800">Locataire.s</label>
						<div className="flex flex-col gap-2">
							<div>
								<Button type="default" onClick={() => this.handleModal('tenants')}>Sélectionner un/des locataire.s</Button>
							</div>
							<div className="flex flex-col gap-2">
								{tenants.map(tenant => {
									return <div className="flex" key={tenant.id}>
										<div className="w-full relative border-2 border-blue-500 rounded-md p-2 bg-blue-50 text-sm">
											<div><u>Référence</u> : <span className="font-medium">{tenant.reference}</span></div>
											<div>{tenant.lastName} {tenant.firstName}</div>
										</div>
										<div className="min-w-[68px] group cursor-pointer hover:border-red-300 hover:bg-red-50 border-2 pl-8 pr-4 flex items-center justify-center rounded-r-md -ml-4"
											 onClick={() => this.handleSelectTenant(tenant)}>
											<span className="icon-cancel group-hover:text-red-500 !font-medium"></span>
										</div>
									</div>
								})}
							</div>
						</div>
						{errorTenants ? <ErrorContent error={errorTenants} /> : null }
					</div>

					<div className="flex gap-4">
						<div className="w-full">
							{rights !== "1"
								? <InputView identifiant="userId" valeur={userName} {...params0}>
									Attribution
								</InputView>
								: <Select identifiant="userId" valeur={userId} items={usersItems} {...params0}>
									Attribution
								</Select>
							}
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
								 content={<Properties donnees={JSON.stringify(properties)}
													  propertiesSelected={property ? [property] : []}
													  onSelector={this.handleSelectProperty} key={property ? property.id : 0} />}
			/>, document.body)}

			{createPortal(<Modal ref={this.tenants} identifiant='inventory-tenants' maxWidth={1280} margin={2} zIndex={41} bgColor="bg-gray-100"
								 title="Sélectionner un/des locataire.s"
								 content={<Tenants donnees={JSON.stringify(this.props.tenants)}
												   tenantsSelected={tenants}
												   onSelector={this.handleSelectTenant} key={tenants.length} />}
			/>, document.body)}
		</>
	}
}
