import React, { useRef } from "react";
import PropTypes from 'prop-types';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { ButtonIcon, ButtonIconDropdown } from "@tailwindComponents/Elements/Button";

export function TenantsItem ({ elem, highlight, onModal })
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
    ]

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <div className="font-medium">{elem.lastName} {elem.firstName}</div>
                    {elem.phone || elem.email
                        ? <div className="text-sm text-gray-600 break-all	">
                            <div>{elem.phone}</div>
                            <div>{elem.email ? elem.email.split(';').map((it, index) => {
                                return <div key={index}>{it}</div>
                            }) : null}</div>
                        </div>
                        : null
                    }
                </div>
                <div className="col-2">
                    <Badge type="blue">{elem.reference}</Badge>
                </div>
                <div className="col-3 text-sm text-gray-600">
                    <div className="font-medium">
                        <div>{elem.addr1}</div>
                        <div>{elem.addr2}</div>
                        <div>{elem.addr3}</div>
                    </div>
                    <div>{elem.zipcode} {elem.city}</div>
                </div>
                <div className="col-4 actions">
                    <ButtonIcon type="default" icon="receipt" onClick={() => onModal('details', elem)} tooltipWidth={82}>Voir les Edls</ButtonIcon>
                    {elem.canActions
                        ? <ButtonIconDropdown icon="more" items={menu} />
                        : <ButtonIcon type="default" icon="pencil" onClick={() => onModal('form', elem)}>Modifier</ButtonIcon>
                    }
                </div>
            </div>
        </div>
    </div>
}

TenantsItem.propTypes = {
    elem: PropTypes.object.isRequired,
    highlight: PropTypes.number,
}
