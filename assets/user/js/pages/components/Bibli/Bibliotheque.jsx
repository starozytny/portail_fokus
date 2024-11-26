import React, { Component } from "react";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { Button } from "@tailwindComponents/Elements/Button";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";

import { Rooms } from "@userPages/Bibli/Rooms/Rooms";
import { Keys } from "@userPages/Bibli/Keys/Keys";
import { Counters } from "@userPages/Bibli/Counters/Counters";
import { Natures } from "@userPages/Bibli/Natures/Natures";
import { Aspects } from "@userPages/Bibli/Aspects/Aspects";
import { Elements } from "@userPages/Bibli/Elements/Elements";

const URL_GET_DATA = "intern_api_fokus_bibli_global_list";

export class Bibliotheque extends Component {
	constructor (props) {
		super(props);

		this.state = {
			pageId: props.pageId ? parseInt(props.pageId) : 0,
			highlight: props.highlight,
			loadingData: true,
			rooms: "[]",
			keysType: "[]",
			countersType: "[]",
			natures: "[]",
			aspects: "[]",
			elements: "[]",
			categories: [],
			elementsNatures: [],
		}
	}

	componentDidMount () {
		const { numSociety } = this.props;

		const self = this;
		axios({ method: "GET", url: Routing.generate(URL_GET_DATA, {numSociety: numSociety}), data: {} })
			.then(function (response) {
				let data = response.data;

				self.setState({
					rooms: data.rooms,
					keysType: data.keysType,
					countersType: data.countersType,
					natures: data.natures,
					aspects: data.aspects,
					elements: data.elements,
					categories: JSON.parse(data.categories),
					elementsNatures: JSON.parse(data.elementsNatures),
					loadingData: false
				})
			})
			.catch(function (error) { Formulaire.displayErrors(self, error); })
		;
	}

	handleChangePage = (id) => {
		this.setState({ pageId: id, highlight: null });
	}

	render () {
		const { loadingData, pageId, highlight, rooms, keysType, countersType, natures, aspects, elements, categories, elementsNatures } = this.state;

		let menu = [
			{ id: 0, label: "Pièces" },
			{ id: 1, label: "Clés" },
			{ id: 2, label: "Compteurs" },
			{ id: 3, label: "Natures" },
			{ id: 4, label: "Aspects" },
			{ id: 5, label: "Éléments" },
		]

		let paramsPage = { pageId: pageId, highlight: highlight };

		let content, pageName;
		switch (pageId){
			case 5:
				pageName = "éléments";
				content = <Elements {...paramsPage} donnees={elements} key={pageId}
									categories={categories} elementsNatures={elementsNatures} natures={JSON.parse(natures)} />;
				break;
			case 4:
				pageName = "aspects";
				content = <Aspects {...paramsPage} donnees={aspects} key={pageId} />;
				break;
			case 3:
				pageName = "natures";
				content = <Natures {...paramsPage} donnees={natures} key={pageId} />;
				break;
			case 2:
				pageName = "compteurs";
				content = <Counters {...paramsPage} donnees={countersType} key={pageId} />;
				break;
			case 1:
				pageName = "clés";
				content = <Keys {...paramsPage} donnees={keysType} key={pageId} />;
				break;
			default:
				pageName = "pièces";
				content = <Rooms {...paramsPage} donnees={rooms} key={pageId} />;
				break;
		}

		return <>
			<div className="text-xl font-semibold mb-2">Les catégories de la bibliothèque</div>
			<div className="grid grid-cols-2 gap-2 md:grid-cols-6">
				{menu.map(item => {
					return <Button type={item.id === pageId ? "color3" : "default"} key={item.id}
								   onClick={() => this.handleChangePage(item.id)}>
						{item.label}
					</Button>
				})}
			</div>
			<div className="mt-4">
				{loadingData
					? <LoaderElements />
					: <>
						<div className="text-xl font-semibold mb-2">Liste des {pageName}</div>
						{content}
					</>
				}
			</div>
		</>
	}
}
