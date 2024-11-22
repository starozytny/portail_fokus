import React, { useRef } from "react";
import PropTypes from 'prop-types';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { ButtonIcon } from "@tailwindComponents/Elements/Button";
import { Badge } from "@tailwindComponents/Elements/Badge";

export function TenantsItem ({ elem, highlight, onModal })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

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
                    <ButtonIcon type="default" icon="receipt" onClick={() => onModal('update', elem)} tooltipWidth={82}>Voir les Edls</ButtonIcon>
                    <ButtonIcon type="default" icon="pencil" onClick={() => onModal('update', elem)}>Modifier</ButtonIcon>
                </div>
            </div>
        </div>
    </div>
}

TenantsItem.propTypes = {
    elem: PropTypes.object.isRequired,
    highlight: PropTypes.number,
}
