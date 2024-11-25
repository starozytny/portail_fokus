import React, { Component } from "react";

import { Button } from "@tailwindComponents/Elements/Button";

import { Rooms } from "@userPages/Bibli/Rooms/Rooms";
import { Keys } from "@userPages/Bibli/Keys/Keys";

export class Bibliotheque extends Component {
	constructor (props) {
		super(props);

		this.state = {
			pageId: 0,
			highlight: props.highlight
		}
	}

	handleChangePage = (id) => {
		this.setState({ pageId: id, highlight: null });
	}

	render () {
		const { numSociety } = this.props;
		const { pageId, highlight } = this.state;

		let menu = [
			{ id: 0, label: "Pièces" },
			{ id: 1, label: "Clés" },
			{ id: 2, label: "Compteurs" },
			{ id: 3, label: "Natures" },
			{ id: 4, label: "Aspects" },
			{ id: 5, label: "Éléments" },
		]

		let paramsPage = { numSociety: numSociety, highlight: highlight };

		let content;
		switch (pageId){
			case 1:
				content = <Keys {...paramsPage} />;
				break;
			default:
				content = <Rooms {...paramsPage} />;
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
				{content}
			</div>
		</>
	}
}
