import React, { Component } from 'react';

import axios from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Inputs from "@commonFunctions/inputs";
import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Button } from "@tailwindComponents/Elements/Button";
import { CloseModalBtn } from "@tailwindComponents/Elements/Modal";
import { Input, InputCity, InputView } from "@tailwindComponents/Elements/Fields";

const URL_INDEX_ELEMENTS = "user_tenants_index";
const URL_CREATE_ELEMENT = "intern_api_fokus_tenants_create";
const URL_UPDATE_ELEMENT = "intern_api_fokus_tenants_update";

let saveZipcodes = [];

export function BienFormulaire ({ context, element, identifiant }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_ELEMENT, { id: element.id });
	}

	return  <Form
        context={context}
        url={url}
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
        isFurnished={element ? Formulaire.setValue(element.isFurnished) : ""}

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

	handleChange = (e) => { this.setState({ [e.currentTarget.name]: e.currentTarget.value, openCities: "" }) }

	handleChangeCity = (e) => {
		Inputs.cityInput(this, e, this.state.zipcode, this.state.arrayZipcodes ? this.state.arrayZipcodes : saveZipcodes)
	}

	handleSelectCity = (name, value) => {
		this.setState({ [name]: value, openCities: "" })
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { context, url } = this.props;
		const { addr1, building, type, surface, floor, door, rooms, owner, isFurnished } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'addr1', value: addr1 },
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
		const {
			errors, reference, addr1, addr2, addr3, zipcode, city, cities, openCities,
			building, type, surface, floor, door, rooms, owner, isFurnished
		} = this.state;

		let params0 = { errors: errors, onChange: this.handleChange };

		return <>
			<div className="px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
				<div className="flex flex-col gap-4">
					<div>
						<InputView valeur={context === "update" ? reference : "Attribution auto."} identifiant="reference" {...params0}>Référence</InputView>
					</div>

					<div className="flex flex-col gap-4">
						<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
							<div className="col-span-2 md:col-span-1">
								<Input valeur={addr1} identifiant="addr1" {...params0}>Adresse</Input>
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
									Code postal
								</Input>
							</div>
							<div>
								<InputCity identifiant="city" valeur={city} {...params0}
										   cities={cities} openCities={openCities} onSelectCity={this.handleSelectCity}>
									Ville
								</InputCity>
							</div>
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
		</>
	}
}
