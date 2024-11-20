import React, { useEffect, useState } from "react";

import axios from "axios";
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Formulaire from "@commonFunctions/formulaire";

const URL_GET_CREDIT = "intern_api_administration_clients_credits";

export function Credits ({ numSociety }) {
	const [credits, setCredits] = useState(0);
	const [load, setLoad] = useState(true);

	useEffect(() => {
		axios({ method: "GET", url: Routing.generate(URL_GET_CREDIT, {numSociety: numSociety}), data: {} })
			.then(function (response) {
				setCredits(response.data.credits);
				setLoad(false);
			})
			.catch(function (error) {
				Formulaire.displayErrors(null, error);
			})
		;
	}, []);

	return <div>
		{load
			? <span className="icon-chart-3"></span>
			: <span>{credits} crédits restants</span>
		}
	</div>
}
