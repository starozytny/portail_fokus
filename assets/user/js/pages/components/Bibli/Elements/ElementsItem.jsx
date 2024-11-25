import React, { useRef } from "react";
import PropTypes from 'prop-types';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { ButtonIcon } from "@tailwindComponents/Elements/Button";

export function ElementsItem ({ elem, categories, elementsNature, natures, highlight, onModal })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    let categoryName = "";
    categories.forEach(cat => {
        if(cat.id === elem.category){
            categoryName = cat.name;
        }
    })

    let variants = elem.variants !== "" ? JSON.parse(elem.variants) : [];

    let elemNatures = [];
    elementsNature.forEach(eln => {
        if(eln.elementId === elem.id){
            natures.forEach(nat => {
                if(eln.natureId === nat.id){
                    elemNatures.push(nat.name);
                }
            })
        }
    })

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <div className="font-medium">{elem.name}</div>
                </div>
                <div className="col-2 text-gray-600 text-sm">
                    <div>{categoryName} {categoryName !== "" ? "/" : ""} {elem.familyString.toLowerCase()}</div>
                </div>
                <div className="col-3 text-gray-600 text-sm">
                    {variants.map((va, index) => {
                        return <div key={index}>{va}</div>
                    })}
                </div>
                <div className="col-4 text-gray-600 text-sm">
                    {elemNatures.map((eln, index) => {
                        return <div key={index}>{eln}</div>
                    })}
                </div>
                <div className="col-5 actions">
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

ElementsItem.propTypes = {
    elem: PropTypes.object.isRequired,
    highlight: PropTypes.number,
}
