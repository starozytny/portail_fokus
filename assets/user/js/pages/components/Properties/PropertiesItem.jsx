import React, { useRef } from "react";
import PropTypes from 'prop-types';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { Selector } from "@tailwindComponents/Elements/Selector";
import { ButtonIcon, ButtonIconDropdown } from "@tailwindComponents/Elements/Button";

export function PropertiesItem ({ elem, highlight, onModal, onSelector, propertiesSelected })
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

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <div className="flex flex-row gap-2">
                        {onSelector
                            ? <Selector elem={elem} elements={propertiesSelected} onSelectors={onSelector} />
                            : null
                        }
                        <div onClick={onSelector ? () => onSelector(elem) : null}>
                            <div className="font-medium">
                                <div>{elem.addr1}</div>
                                <div>{elem.addr2}</div>
                                <div>{elem.addr3}</div>
                            </div>
                            <div>{elem.zipcode} {elem.city}</div>
                        </div>
                    </div>
                </div>
                <div className="col-2" onClick={onSelector ? () => onSelector(elem) : null}>
                    <div className="font-semibold">{elem.reference}</div>
                    <div className="text-sm text-gray-600">
                        <div>Propriétaire : {elem.owner ? elem.owner : "Non renseigné"}</div>
                        <div>Locataire : {elem.currentTenant ? <DisplayTenant tenant={elem.currentTenant} /> : "Non renseigné"}</div>
                    </div>
                </div>
                <div className="col-3 text-sm text-gray-600" onClick={onSelector ? () => onSelector(elem) : null}>
                    {elem.building && <div>Bâtiment : {elem.building}</div>}
                    {elem.type && <div>Type : {elem.type}</div>}
                    {elem.isFurnished && parseInt(elem.isFurnished) !== 0 && <div>Meublé</div>}

                    {elem.door || (elem.floor !== "" && elem.floor !== "0")
                        ? <div className="flex gap-4">
                            {elem.door && <div>Porte : {elem.door}</div>}
                            {elem.floor !== "" && elem.floor !== "0" && <div>Étage : {elem.floor}</div>}
                        </div>
                        : null
                    }
                    {parseInt(elem.surface) > 0 && <div>{elem.surface} m²</div>}
                    {parseInt(elem.rooms) !== 0 && <div>{elem.rooms} {parseInt(elem.rooms) > 1 ? "pièces" : "pièce"}</div>}
                </div>
                <div className="col-4 actions">
                    {onSelector
                        ? null
                        : <>
                            {elem.inventories.length > 0
                                ? <ButtonIcon type="default" icon="receipt" onClick={() => onModal('details', elem)} tooltipWidth={82}>Voir les Edls</ButtonIcon>
                                : null
                            }
                            {elem.canActions
                                ? <ButtonIconDropdown icon="more" items={menu} />
                                : <ButtonIcon type="default" icon="pencil" onClick={() => onModal('form', elem)}>Modifier</ButtonIcon>
                            }
                        </>
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

function DisplayTenant({ tenant })
{
    let content = tenant;

    if(tenant.indexOf("$") !== -1){
        tenant = tenant.replaceAll("$", "")
        content = <>Vacant ({tenant})</>
    }

    return <span>{content}</span>
}
