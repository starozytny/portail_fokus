import React, { useRef } from "react";
import PropTypes from 'prop-types';

import Sanitaze from "@commonFunctions/sanitaze";

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { ButtonIconDropdown } from "@tailwindComponents/Elements/Button";

export function InventoriesItem ({ elem, highlight, onModal })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    let styleItemDropdown = "w-full inline-block px-2 py-1.5 cursor-pointer hover:bg-gray-100";

    let menu = [
        { data: <div className={styleItemDropdown} onClick={() => onModal("details", elem)}>
                <span className="icon-vision" />
                <span className="pl-1">Détails</span>
            </div> },
        { data: <div className={styleItemDropdown} onClick={() => onModal("form", elem)}>
                <span className="icon-pencil" />
                <span className="pl-1">Modifier</span>
            </div> },
        { data: <div className={styleItemDropdown} onClick={() => onModal("delete", elem)}>
                <span className="icon-trash" />
                <span className="pl-1">Supprimer</span>
            </div> },
    ];

    console.log(elem);

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <div className="font-medium">{elem.date === 0 ? "Indéfinie" : Sanitaze.timestampToDateForm(elem.date)}</div>
                </div>
                <div className="col-2">
                </div>
                <div className="col-3 text-sm text-gray-600">
                </div>
                <div className="col-4 text-sm text-gray-600">
                </div>
                <div className="col-5 text-sm text-gray-600">
                </div>
                <div className="col-6 actions">
                    <ButtonIconDropdown icon="more" items={menu} />
                </div>
            </div>
        </div>
    </div>
}

InventoriesItem.propTypes = {
    elem: PropTypes.object.isRequired,
    highlight: PropTypes.number,
}

function DisplayTenant({ tenant })
{
    let content = tenant;

    if(tenant.indexOf("$") !== -1){
        tenant = tenant.replaceAll("$", "")
        content = <>Vacant ({tenant})</>
    }

    return <span>{content}</span>
}
