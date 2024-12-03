import React, { Component } from 'react';

import axios from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Inputs from "@commonFunctions/inputs";
import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Button } from "@tailwindComponents/Elements/Button";
import { CloseModalBtn } from "@tailwindComponents/Elements/Modal";
import { Input, InputCity, InputView } from "@tailwindComponents/Elements/Fields";
import { Alert } from "@tailwindComponents/Elements/Alert";

const URL_INDEX_ELEMENTS = "user_tenants_index";
const URL_CREATE_ELEMENT = "intern_api_fokus_tenants_create";
const URL_UPDATE_ELEMENT = "intern_api_fokus_tenants_update";

let saveZipcodes = [];

export function TenantFormulaire ({ context, element, identifiant }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_ELEMENT, { id: element.id });
	}

	return  <Form
        context={context}
        url={url}
		reference={element ? Formulaire.setValue(element.reference) : ""}
        lastName={element ? Formulaire.setValue(element.lastName) : ""}
        firstName={element ? Formulaire.setValue(element.firstName) : ""}
        phone={element ? Formulaire.setValue(element.phone) : ""}
        email={element ? Formulaire.setValue(element.email) : ""}
        addr1={element ? Formulaire.setValue(element.addr1) : ""}
        addr2={element ? Formulaire.setValue(element.addr2) : ""}
        addr3={element ? Formulaire.setValue(element.addr3) : ""}
        zipcode={element ? Formulaire.setValue(element.zipcode) : ""}
        city={element ? Formulaire.setValue(element.city) : ""}

		identifiant={identifiant}
    />
}

class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			reference: props.reference,
			lastName: props.lastName,
			firstName: props.firstName,
			phone: props.phone,
			email: props.email,
			addr1: props.addr1,
			addr2: props.addr2,
			addr3: props.addr3,
			zipcode: props.zipcode,
			city: props.city,
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
		const { lastName, reference, firstName, phone, email, addr1, addr2, addr3, zipcode, city } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'lastName', value: lastName },
			{ type: "length", id: 'reference', value: reference, min: 0, max: 5 },
			{ type: "length", id: 'lastName', value: lastName, min: 1, max: 80 },
			{ type: "length", id: 'firstName', value: firstName, min: 0, max: 80 },
			{ type: "length", id: 'phone', value: phone, min: 0, max: 15 },
			{ type: "length", id: 'email', value: email, min: 0, max: 80 },
			{ type: "length", id: 'addr1', value: addr1, min: 0, max: 80 },
			{ type: "length", id: 'addr2', value: addr2, min: 0, max: 80 },
			{ type: "length", id: 'addr3', value: addr3, min: 0, max: 80 },
			{ type: "length", id: 'zipcode', value: zipcode, min: 0, max: 5 },
			{ type: "length", id: 'city', value: city, min: 0, max: 40 },
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
					console.log(error)
					console.log(error.response)
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { context, identifiant } = this.props;
		const { errors, reference, lastName, firstName, phone, email, addr1, addr2, addr3, zipcode, city, cities, openCities } = this.state;

		let params0 = { errors: errors, onChange: this.handleChange };

		return <>
			<div className="px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
				<div className="flex flex-col gap-4">
					<div>
						<InputView valeur={context === "update" ? reference : "Attribution auto."} identifiant="reference" {...params0}>Référence</InputView>
					</div>
					<div className="flex gap-4">
						<div className="w-full">
							<Input valeur={lastName} identifiant="lastName" {...params0}>Nom</Input>
						</div>
						<div className="w-full">
							<Input valeur={firstName} identifiant="firstName" {...params0}>Prénom</Input>
						</div>
					</div>
					<div className="flex gap-4">
						<div className="w-full">
							<Input valeur={phone} identifiant="phone" {...params0}>Téléphone</Input>
						</div>
						<div className="w-full">
							<Input valeur={email} identifiant="email" {...params0}>Email</Input>
						</div>
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
