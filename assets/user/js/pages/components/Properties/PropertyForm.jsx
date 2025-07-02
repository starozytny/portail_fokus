import React, { Component } from 'react';

import axios from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Inputs from "@commonFunctions/inputs";
import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Alert } from "@tailwindComponents/Elements/Alert";
import { Button } from "@tailwindComponents/Elements/Button";
import { CloseModalBtn } from "@tailwindComponents/Elements/Modal";
import { Input, InputCity, InputView, Switcher } from "@tailwindComponents/Elements/Fields";

const URL_INDEX_ELEMENTS = "user_properties_index";
const URL_CREATE_ELEMENT = "intern_api_fokus_properties_create";
const URL_UPDATE_ELEMENT = "intern_api_fokus_properties_update";

let saveZipcodes = [];

export function PropertyFormulaire ({ context, element, identifiant, onUpdateList }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_ELEMENT, { id: element.id });
	}

	return  <Form
        context={context}
        url={url}
		onUpdateList={onUpdateList}

		reference={element ? Formulaire.setValue(element.reference) : ""}
        addr1={element ? Formulaire.setValue(element.addr1) : ""}
        addr2={element ? Formulaire.setValue(element.addr2) : ""}
        addr3={element ? Formulaire.setValue(element.addr3) : ""}
        zipcode={element ? Formulaire.setValue(element.zipcode) : ""}
        city={element ? Formulaire.setValue(element.city) : ""}
        building={element ? Formulaire.setValue(element.building) : ""}
        type={element ? Formulaire.setValue(element.type) : ""}
        surface={element ? Formulaire.setValue(element.surface) : ""}
        floor={element ? Formulaire.setValue(element.floor) : ""}
        door={element ? Formulaire.setValue(element.door) : ""}
        rooms={element ? Formulaire.setValue(element.rooms) : ""}
        owner={element ? Formulaire.setValue(element.owner) : ""}
        isFurnished={element ? element.isFurnished ? [1] : [0] : [0]}

		identifiant={identifiant}
    />
}

class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			reference: props.reference,
			phone: props.phone,
			email: props.email,
			addr1: props.addr1,
			addr2: props.addr2,
			addr3: props.addr3,
			zipcode: props.zipcode,
			city: props.city,
			building: props.building,
			type: props.type,
			surface: props.surface,
			floor: props.floor,
			door: props.door,
			rooms: props.rooms,
			owner: props.owner,
			isFurnished: props.isFurnished,
			errors: [],
			arrayZipcodes: [],
			openCities: "",
			cities: [],
		}
	}

	componentDidMount () {
		Inputs.getZipcodes(this);
	}


	handleChange = (e) => {
		let name = e.currentTarget.name;
		let value = e.currentTarget.value;

		if (name === "reference") {
			value = value !== "" ? value.toUpperCase() : value;
			value = value.length > 10 ? this.state[name] : value;
		}

		if (name === "isFurnished") {
			value = e.currentTarget.checked ? [parseInt(value)] : [0];
		}


		if (name === "surface") {
			value = value !== "" ? value.replace(',', '.') : value;
		}

		this.setState({ [name]: value, openCities: "" })
	}

	handleChangeCity = (e) => {
		Inputs.cityInput(this, e, this.state.zipcode, this.state.arrayZipcodes ? this.state.arrayZipcodes : saveZipcodes)
	}

	handleSelectCity = (name, value) => {
		this.setState({ [name]: value, openCities: "" })
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { context, url, onUpdateList } = this.props;
		const { reference, addr1, addr2, addr3, zipcode, city, type, floor, door, building, owner } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'reference', value: reference },
			{ type: "text", id: 'addr1', value: addr1 },
			{ type: "text", id: 'zipcode', value: zipcode },
			{ type: "text", id: 'city', value: city },
			{ type: "uniqueLength", id: 'reference', value: reference, size: 10 },
			{ type: "length", id: 'addr1', value: addr1, min: 1, max: 64 },
			{ type: "length", id: 'addr2', value: addr2, min: 0, max: 64 },
			{ type: "length", id: 'addr3', value: addr3, min: 0, max: 64 },
			{ type: "length", id: 'zipcode', value: zipcode, min: 0, max: 10 },
			{ type: "length", id: 'city', value: city, min: 0, max: 64 },
			{ type: "length", id: 'type', value: type, min: 0, max: 24 },
			{ type: "length", id: 'floor', value: floor, min: 0, max: 24 },
			{ type: "length", id: 'door', value: door, min: 0, max: 20 },
			{ type: "length", id: 'building', value: building, min: 0, max: 40 },
			{ type: "length", id: 'owner', value: owner, min: 0, max: 32 },
		];

		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			let self = this;
			Formulaire.loader(true);

			saveZipcodes = this.state.arrayZipcodes;
			delete this.state.arrayZipcodes;

			axios({ method: context === "create" ? "POST" : "PUT", url: url, data: this.state })
				.then(function (response) {
					if(onUpdateList){
						onUpdateList(response.data, context);
					}else{
						location.href = Routing.generate(URL_INDEX_ELEMENTS, { h: response.data.id });
					}
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
		const {
			errors, reference, addr1, addr2, addr3, zipcode, city, cities, openCities,
			building, type, surface, floor, door, rooms, owner, isFurnished
		} = this.state;

		let switcherItems = [{ value: 1, label: "Oui", identifiant: "prop-oui" }];

		let params0 = { errors: errors, onChange: this.handleChange };

		return <>
			<div className="px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
				<div className="flex flex-col gap-4">
					<div>
						{context === "create"
							? <Input valeur={reference} identifiant="reference" {...params0}>Référence <span className="text-xs">(10 carac.)</span> *</Input>
							: <InputView valeur={reference} identifiant="reference" {...params0}>Référence *</InputView>
						}
					</div>

					<div className="flex flex-col gap-4">
						<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
							<div className="col-span-2 md:col-span-1">
								<Input valeur={addr1} identifiant="addr1" {...params0}>Adresse *</Input>
							</div>
							<div>
								<Input valeur={addr2} identifiant="addr2" {...params0}>Complément</Input>
							</div>
							<div>
								<Input valeur={addr3} identifiant="addr3" {...params0}>Suite adresse</Input>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<Input valeur={zipcode} identifiant="zipcode" errors={errors} onChange={this.handleChangeCity} type="cleave-zipcode">
									Code postal *
								</Input>
							</div>
							<div>
								<InputCity identifiant="city" valeur={city} {...params0}
										   cities={cities} openCities={openCities} onSelectCity={this.handleSelectCity}>
									Ville *
								</InputCity>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							<div>
								<Input valeur={type} identifiant="type" {...params0}>Type de bien</Input>
							</div>
							<div>
								<Input valeur={building} identifiant="building" {...params0}>Bâtiment</Input>
							</div>
							<div>
								<Input valeur={door} identifiant="door" {...params0}>Porte</Input>
							</div>
							<div>
								<Input valeur={floor} identifiant="floor" {...params0}>Étage</Input>
							</div>
						</div>
						<div className="flex flex-col gap-4 md:flex-row">
							<div className="w-full flex gap-4">
								<div className="w-full">
									<Input valeur={surface} identifiant="surface" {...params0}>Surface (m²)</Input>
								</div>
								<div className="w-full">
									<Input valeur={rooms} identifiant="rooms" {...params0}>Nombre de pièces</Input>
								</div>
							</div>
							<div className="w-full">
								<Switcher items={switcherItems} identifiant="isFurnished" valeur={isFurnished} {...params0}>
									Est-ce meublé ?
								</Switcher>
							</div>
						</div>
						<div>
							<div>
								<Input valeur={owner} identifiant="owner" {...params0}>Propriétaire</Input>
							</div>
						</div>
					</div>

					<div>
						<Alert type="gray" icon="question">N'oubliez pas de re-synchroniser votre appareil.</Alert>
					</div>
				</div>
			</div>

			<div className="bg-gray-50 px-4 py-3 flex flex-row justify-end gap-2 sm:px-6 border-t rounded-b-lg">
				<CloseModalBtn identifiant={identifiant} />
				<Button type="blue" onClick={this.handleSubmit}>
					{context === "create" ? "Enregistrer" : "Enregistrer les modifications"}
				</Button>
			</div>
		</>
	}
}
