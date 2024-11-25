import React, { useRef } from "react";
import PropTypes from 'prop-types';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { ButtonIcon } from "@tailwindComponents/Elements/Button";

export function CountersItem ({ elem, highlight, onModal })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <div className="font-medium">{elem.name}</div>
                </div>
                <div className="col-2">
                    <div className="font-medium">{elem.unit}</div>
                </div>
                <div className="col-3 actions">
                    {elem.isNative || elem.isUsed
                        ? <Badge type={elem.isNative ? "indigo" : "blue"}>{elem.isNative ? "Natif" : "Utilisé"}</Badge>
                        : <>
                            <ButtonIcon type="default" icon="pencil" onClick={() => onModal('form', elem)}>Modifier</ButtonIcon>
                            <ButtonIcon type="default" icon="trash" onClick={() => onModal('delete', elem)}>Supprimer</ButtonIcon>
                        </>
                    }
                </div>
            </div>
        </div>
    </div>
}

CountersItem.propTypes = {
    elem: PropTypes.object.isRequired,
    highlight: PropTypes.number,
}
