import React, { Component } from "react";
import { Button } from "@tailwindComponents/Elements/Button";

export class Bibliotheque extends Component {
	render () {
		return <>
			<div className="grid grid-cols-2 gap-2 md:grid-cols-6">
				<Button type="default">Pièces</Button>
				<Button type="default">Clés</Button>
				<Button type="default">Compteurs</Button>
				<Button type="default">Natures</Button>
				<Button type="default">Aspects</Button>
				<Button type="default">Éléments</Button>
			</div>
			<div>
				Hello world
			</div>
		</>
	}
}
