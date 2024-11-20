import React, { useRef } from "react";
import PropTypes from 'prop-types';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { ButtonIconDropdown } from "@tailwindComponents/Elements/Button";

export function BiensItem ({ elem, highlight })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    let styleItemDropdown = "w-full inline-block px-2 py-1.5 cursor-pointer hover:bg-gray-100";

    let menu = [
    ]
    console.log(elem);

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <div className="font-medium">{elem.addr1} {elem.addr2} {elem.addr3}</div>
                    <div>{elem.zipcode} {elem.city}</div>
                </div>
                <div className="col-2">
                    <div>{elem.reference}</div>
                    <div className="text-sm text-gray-600">
                        <div>Propriétaire : {elem.owner ? elem.owner : "Non renseigné"}</div>
                        <div>Locataire : {elem.currentTenant ? elem.currentTenant : "Non renseigné"}</div>
                    </div>
                </div>
                <div className="col-3">
                    <div className="text-sm">{elem.lastInventoryUid}</div>
                </div>
                <div className="col-4 actions">
                    <ButtonIconDropdown icon="more" items={menu} />
                </div>
            </div>
        </div>
    </div>
}

BiensItem.propTypes = {
    elem: PropTypes.object.isRequired,
    highlight: PropTypes.number,
}
