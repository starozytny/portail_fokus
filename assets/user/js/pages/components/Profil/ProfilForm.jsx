import React, { Component } from 'react';

import axios from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Alert } from "@tailwindComponents/Elements/Alert";
import { Button } from "@tailwindComponents/Elements/Button";
import { Password } from "@tailwindComponents/Modules/User/Password";
import { Input, InputView } from "@tailwindComponents/Elements/Fields";

const URL_CREATE_ELEMENT = "intern_api_fokus_users_create";
const URL_UPDATE_ELEMENT = "intern_api_fokus_users_update";

export function ProfilFormulaire ({ context, element }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	if (context === "update") {
		url = Routing.generate(URL_UPDATE_ELEMENT, { id: element.id });
	}

	return  <Form
        context={context}
        url={url}
        username={element ? Formulaire.setValue(element.username) : ""}
		firstName={element ? Formulaire.setValue(element.firstName) : ""}
        lastName={element ? Formulaire.setValue(element.lastName) : ""}
        email={element ? Formulaire.setValue(element.email) : ""}
        userTag={element ? Formulaire.setValue(element.userTag) : null}
    />
}

class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			username: props.username,
			first_name: props.firstName,
			last_name: props.lastName,
			email: props.email,
			user_tag: props.userTag,
			password: '',
			password2: '',
			errors: [],
		}
	}

	handleChange = (e) => {
		let name = e.currentTarget.name;
		let value = e.currentTarget.value;

		if(name === "user_tag"){
			if(value.length > 3) value = this.state[name];
		}
		if(name === "username"){
			if(value.length > 5) value = this.state[name];
		}

		this.setState({ [name]: value })
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { context, url } = this.props;
		const { username, first_name, last_name, password, password2, email, user_tag } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'username', value: username },
			{ type: "text", id: 'first_name', value: first_name },
			{ type: "text", id: 'last_name', value: last_name },
			{ type: "email", id: 'email', value: email },
			{ type: "array", id: 'user_tag', value: user_tag },
		];

		if (context === "create") {
			if (password !== "") {
				paramsToValidate = [...paramsToValidate,
					...[{ type: "password", id: 'password', value: password, idCheck: 'password2', valueCheck: password2 }]
				];
			}
		}

		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			let self = this;
			Formulaire.loader(true);
			axios({ method: context === "create" ? "POST" : "PUT", url: url, data: this.state })
				.then(function (response) {
					location.reload();
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { context } = this.props;
		const { errors, username, first_name, last_name, email, password, password2, user_tag } = this.state;

		let params0 = { errors: errors, onChange: this.handleChange }

		return <form onSubmit={this.handleSubmit}>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-4 xl:flex-row">
					<div className="w-full">
						{context === "create"
							? <Input valeur={username} identifiant="username" {...params0}>Identifiant</Input>
							: <InputView valeur={username} identifiant="username">Identifiant</InputView>
						}
					</div>
					<div className="w-full">
						<Input valeur={user_tag} identifiant="user_tag" {...params0}>Tag</Input>
					</div>
				</div>
				<div>
					<Input valeur={email} identifiant="email" {...params0} type="email">Adresse e-mail</Input>
				</div>
				<div className="flex flex-col gap-4 xl:flex-row">
					<div className="w-full">
						<Input identifiant="first_name" valeur={first_name} {...params0}>Prénom</Input>
					</div>
					<div className="w-full">
						<Input identifiant="last_name" valeur={last_name} {...params0}>Nom</Input>
					</div>
				</div>
				{context === "update"
					? <div className="text-xs">
						<Alert type="gray">Laissez les champs vide si vous ne souhaitez pas modifier le mot de passe.</Alert>
					</div>
					: null
				}
				<div>
					<Password password={password} password2={password2} params={params0} isInline={true} />
				</div>
			</div>

			<div className="mt-4 flex justify-end gap-2">
				<Button type="blue" isSubmit={true}>
					{context === "create" ? "Enregistrer" : "Enregistrer les modifications"}
				</Button>
			</div>
		</form>
	}
}
