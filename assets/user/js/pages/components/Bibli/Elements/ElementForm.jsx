import React, { Component } from 'react';

import axios from 'axios';
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";
import Validateur from "@commonFunctions/validateur";

import { Input, Radiobox, Select, SelectCustom } from "@tailwindComponents/Elements/Fields";
import { Button, ButtonIcon } from "@tailwindComponents/Elements/Button";
import { CloseModalBtn } from "@tailwindComponents/Elements/Modal";

const URL_INDEX_ELEMENTS = "user_bibli_index";
const URL_CREATE_ELEMENT = "intern_api_fokus_bibli_elements_create";
const URL_UPDATE_ELEMENT = "intern_api_fokus_bibli_elements_update";

export function ElementFormulaire ({ context, element, categories, elementsNatures, natures, pageId, identifiant }) {
	let url = Routing.generate(URL_CREATE_ELEMENT);

	let elemNatures = [];
	if (context === "update") {
		url = Routing.generate(URL_UPDATE_ELEMENT, { id: element.id });

		elementsNatures.forEach(eln => {
			if(eln.elementId === element.id){
				natures.forEach(nat => {
					if(eln.natureId === nat.id){
						elemNatures.push(nat.id)
					}
				})
			}
		})
	}

	return  <Form
        context={context}
        url={url}
        name={element ? Formulaire.setValue(element.name) : ""}
        gender={element ? (element.gender.substring(0,1) === "f" ? 1 : 0) : 0}
        ortho={element ? (element.gender.substring(1) === "p" ? 1 : 0) : 0}
		category={element ? parseInt(element.category) : 1}
		family={element ? parseInt(element.family) : 0}
		variants={(element && element.variants !== "") ? JSON.parse(element.variants) : []}
		elemNatures={elemNatures}

		categories={categories}
		elementsNatures={elementsNatures}
		natures={natures}

		pageId={pageId}
		identifiant={identifiant}
    />
}

class Form extends Component {
	constructor (props) {
		super(props);

		this.state = {
			name: props.name,
			gender: props.gender,
			ortho: props.ortho,
			category: props.category,
			family: props.family,
			variants: props.variants,
			variant: "",
			elemNatures: props.elemNatures,
			elemNature: "",
			errors: [],
		}

		this.select = React.createRef();
	}

	handleChange = (e) => {
		const { variant } = this.state;

		let name = e.currentTarget.name;
		let value = e.currentTarget.value;

		if(name === "variant"){
			if(!(/^[a-zA-Z0-9éèçàù-]*$/).test(value)){
				value = variant;
			}
		}

		this.setState({[name]: value})
	}

	handleSelect = (name, value, displayValue) => {
		this.setState({ [name]: value });
		this.select.current.handleClose(null, displayValue);
	}

	handleAddVariant = () => {
		const { variants, variant } = this.state;

		if(variant !== ""){
			let newVariants = [];
			if(!variants.includes(variant)){
				newVariants = variants;
				newVariants.push(variant);

				this.setState({ variants: newVariants, variant: "" });
			}
		}
	}

	handleRemoveVariant = (variant) => {
		const { variants } = this.state;

		let newVariants = variants.filter(v => { return v !== variant });
		this.setState({ variants: newVariants });
	}

	handleAddNature = () => {
		const { elemNatures, elemNature } = this.state;

		this.select.current.handleClear();

		if(elemNature !== ""){
			let nElemNatures = [];
			if(!elemNatures.includes(elemNature)){
				nElemNatures = elemNatures;
				nElemNatures.push(parseInt(elemNature));

				this.setState({ elemNatures: nElemNatures, elemNature: "" });
			}
		}
	}

	handleRemoveNature = (nature) => {
		const { elemNatures } = this.state;

		let nElemNatures = elemNatures.filter(v => { return v !== nature });
		this.setState({ elemNatures: nElemNatures });
	}

	handleSubmit = (e) => {
		e.preventDefault();

		const { pageId, context, url } = this.props;
		const { name, gender, ortho, category, family } = this.state;

		this.setState({ errors: [] });

		let paramsToValidate = [
			{ type: "text", id: 'name', value: name },
			{ type: "text", id: 'gender', value: gender },
			{ type: "text", id: 'ortho', value: ortho },
			{ type: "text", id: 'category', value: category },
			{ type: "text", id: 'family', value: family },
			{ type: "length", id: 'name', value: name, min: 1, max: 40 },
		];

		let validate = Validateur.validateur(paramsToValidate)
		if (!validate.code) {
			Formulaire.showErrors(this, validate);
		} else {
			let self = this;
			Formulaire.loader(true);
			axios({ method: context === "create" ? "POST" : "PUT", url: url, data: this.state })
				.then(function (response) {
					location.href = Routing.generate(URL_INDEX_ELEMENTS, { pageId: pageId, h: response.data.id });
				})
				.catch(function (error) {
					Formulaire.displayErrors(self, error);
					Formulaire.loader(false);
				})
			;
		}
	}

	render () {
		const { context, identifiant, categories, natures } = this.props;
		const { errors, name, gender, ortho, category, family, variants, variant, elemNatures, elemNature } = this.state;

		let categoriesChoices = [];
		categories.forEach(cat => {
			categoriesChoices.push({ value: cat.id, label: cat.name, identifiant: 'cat-' + cat.id })
		});

		let familiesChoices = [
			{ value: 0, label: 'classique', identifiant: 'classique' },
			{ value: 1, label: 'fonctionnel', identifiant: 'fonctionnel' },
			{ value: 2, label: 'électrique', identifiant: 'electrique' },
			{ value: 3, label: 'sanitaire', identifiant: 'sanitaire' },
		];

		let genderItems = [
			{ value: 0, label: 'Masculin', identifiant: 'male' },
			{ value: 1, label: 'Féminin', identifiant: 'female' }
		];

		let orthoItems = [
			{ value: 0, label: 'Singulier', identifiant: 'singulier' },
			{ value: 1, label: 'Pluriel', identifiant: 'pluriel' }
		];


		let naturesChoices = [];
		natures.forEach(nat => {
			naturesChoices.push({ value: nat.id, label: nat.name, inputName: nat.name, identifiant: 'nat-' + nat.id })
		});

		let params0 = { errors: errors, onChange: this.handleChange };
		let params1 = { errors: errors, onClick: this.handleSelect };

		return <>
			<div className="px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
				<div className="flex flex-col gap-4">
					<div>
						<Input valeur={name} identifiant="name" {...params0}>Intitulé</Input>
					</div>
					<div className="flex gap-4">
						<div className="w-full">
							<Select identifiant="category" valeur={category} items={categoriesChoices} noEmpty={true} {...params0}>
								Catégorie
							</Select>
						</div>
						<div className="w-full">
							<Select identifiant="family" valeur={family} items={familiesChoices} noEmpty={true} {...params0}>
								Famille
							</Select>
						</div>
					</div>
					<div className="flex gap-4">
						<div className="w-full">
							<Radiobox identifiant="gender" valeur={gender} items={genderItems} {...params0} styleType="fat" classItems="flex gap-2">
								Genre du mot
							</Radiobox>
						</div>
						<div className="w-full">
							<Radiobox identifiant="ortho" valeur={ortho} items={orthoItems} {...params0} styleType="fat" classItems="flex gap-2">
								Le nombre du nom
							</Radiobox>
						</div>
					</div>

					<div className="flex gap-4">
						<div className="w-full flex gap-2">
							<div className="w-full">
								<Input valeur={variant} identifiant="variant" {...params0}>Variantes (facultatif)</Input>
							</div>
							<div>
								<label className="block text-sm font-medium leading-6 text-gray-800">&nbsp;</label>
								<ButtonIcon type="default" icon="add" onClick={this.handleAddVariant}>Ajouter</ButtonIcon>
							</div>
						</div>
						<div className="w-full">
							{variants.length !== 0 && <>
								<label className="block text-sm font-medium leading-6 text-gray-800">Liste des variantes ajoutées</label>
								<div className="flex flex-col divide-y">
									{variants.map((v, index) => {
										return <div className="flex items-center justify-between gap-2 py-1" key={index}>
											<div className="text-sm">- {v}</div>
											<ButtonIcon type="default" icon="trash" onClick={() => this.handleRemoveVariant(v)}>Supprimer</ButtonIcon>
										</div>
									})}
								</div>
							</>}
						</div>
					</div>

					<div className="flex gap-4">
						<div className="w-full flex gap-2">
							<div className="w-full">
								<SelectCustom ref={this.select} identifiant="elemNature" inputValue={elemNature}
											  items={naturesChoices} {...params1}>Natures (facultatif)</SelectCustom>
							</div>
							<div>
								<label className="block text-sm font-medium leading-6 text-gray-800">&nbsp;</label>
								<ButtonIcon type="default" icon="add" onClick={this.handleAddNature}>Associer</ButtonIcon>
							</div>
						</div>
						<div className="w-full">
							{elemNatures.length !== 0 && <>
								<label className="block text-sm font-medium leading-6 text-gray-800">Liste des natures ajoutées</label>
								<div className="flex flex-col divide-y">
									{elemNatures.map((n, index) => {

										let nString = "";
										natures.forEach(nat => {
											if(nat.id === n){
												nString = nat.name;
											}
										})

										return <div className="flex items-center justify-between gap-2 py-1" key={index}>
											<div className="text-sm">{nString}</div>
											<ButtonIcon type="default" icon="trash" onClick={() => this.handleRemoveNature(n)}>Supprimer</ButtonIcon>
										</div>
									})}
								</div>
							</>}
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
