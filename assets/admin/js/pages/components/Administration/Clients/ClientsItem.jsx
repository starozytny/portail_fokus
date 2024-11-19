import React, { useRef } from "react";
import PropTypes from 'prop-types';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

export function ClientsItem ({ elem, highlight })
{
	const refItem = useRef(null);

	let nHighlight = useHighlight(highlight, elem.id, refItem);

	return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
		<div className="item-content">
			<div className="item-infos">
				<div className="col-1 flex flex-row gap-4">
					<div className="w-32 h-24 rounded-md overflow-hidden">
						{elem.logo
							? <img src={"data:image/png;base64, " + elem.logo} alt="logo" className="bg-gray-50 w-full h-full object-contain" />
							: <div className="bg-gray-200 w-full h-full flex items-center justify-center text-xs">Aucun logo</div>
						}
					</div>
					<div>
						<div className="font-semibold">{elem.numSociety} - {elem.name}</div>
						<div className="text-gray-600 text-sm">
							<div>{elem.addr1} {elem.addr2}, {elem.zipcode} {elem.city}</div>
							{elem.email || elem.phone
								? <div className="mt-2">
									<div>{elem.email}</div>
									<div>{elem.phone}</div>
								</div>
								: null
							}
						</div>
					</div>
				</div>
				<div className="col-2">
					<div>{elem.manager}</div>
				</div>
				<div className="col-3 text-gray-600 text-sm">
					<div>{elem.credits}/{elem.totalCredits}</div>
				</div>
				<div className="col-4 actions">
					{elem.isLogilink ? "Gérance" : ""}
				</div>
			</div>
		</div>
	</div>
}

ClientsItem.propTypes = {
	elem: PropTypes.object.isRequired,
	highlight: PropTypes.number,
}
