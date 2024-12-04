import React, { useRef } from "react";
import PropTypes from 'prop-types';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { ButtonIcon, ButtonIconDropdown } from "@tailwindComponents/Elements/Button";

export function PropertiesItem ({ elem, element, isAssignation, highlight, onModal })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    let menu = [];
    if(!isAssignation){
        let styleItemDropdown = "w-full inline-block px-2 py-1.5 cursor-pointer hover:bg-gray-100";

        menu = [
            { data: <a className={styleItemDropdown} onClick={() => onModal("lastInventory", elem, null)}>
                    <span className="icon-refresh" />
                    <span className="pl-1">Assigner un dernier EDL</span>
                </a> },
        ]
    }

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <div className="font-medium">
                        <div>{elem.addr1}</div>
                        <div>{elem.addr2}</div>
                        <div>{elem.addr3}</div>
                    </div>
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
                    {isAssignation
                        ? <ButtonIcon type="default" icon="copy" tooltipWidth={152} onClick={() => onModal("confirmAssign", element, elem)}>
                            Récupérer ce dernier EDL
                        </ButtonIcon>
                        : <ButtonIconDropdown icon="more" items={menu} />
                    }
                </div>
            </div>
        </div>
    </div>
}

PropertiesItem.propTypes = {
    elem: PropTypes.object.isRequired,
    highlight: PropTypes.number,
}
