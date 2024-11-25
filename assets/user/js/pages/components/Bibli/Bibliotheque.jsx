import React, { Component } from "react";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

import { Button } from "@tailwindComponents/Elements/Button";

import { Rooms } from "@userPages/Bibli/Rooms/Rooms";
import { Keys } from "@userPages/Bibli/Keys/Keys";
import { Counters } from "@userPages/Bibli/Counters/Counters";
import { LoaderElements } from "@tailwindComponents/Elements/Loader";

const URL_GET_DATA = "intern_api_fokus_bibli_global_list";

export class Bibliotheque extends Component {
	constructor (props) {
		super(props);

		this.state = {
			pageId: props.pageId ? parseInt(props.pageId) : 0,
			highlight: props.highlight,
			loadingData: true,
			rooms: [],
			keysType: [],
			countersType: [],
			natures: [],
			aspects: [],
			elements: [],
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
		const { loadingData, pageId, highlight, rooms, keysType, countersType, natures, aspects, elements } = this.state;

		let menu = [
			{ id: 0, label: "Pièces" },
			{ id: 1, label: "Clés" },
			{ id: 2, label: "Compteurs" },
			{ id: 3, label: "Natures" },
			{ id: 4, label: "Aspects" },
			{ id: 5, label: "Éléments" },
		]

		let paramsPage = { pageId: pageId, highlight: highlight };

		let content;
		switch (pageId){
			case 2:
				content = <Counters {...paramsPage} donnees={countersType} />;
				break;
			case 1:
				content = <Keys {...paramsPage} donnees={keysType} />;
				break;
			default:
				content = <Rooms {...paramsPage} donnees={rooms} />;
				break;
		}

		return <>
			<div className="grid grid-cols-2 gap-2 md:grid-cols-6">
				{menu.map(item => {
					return <Button type={item.id === pageId ? "color3" : "default"} key={item.id}
								   onClick={() => this.handleChangePage(item.id)}>
						{item.label}
					</Button>
				})}
			</div>
			<div className="mt-4">
				{loadingData ? <LoaderElements /> : content}
			</div>
		</>
	}
}
