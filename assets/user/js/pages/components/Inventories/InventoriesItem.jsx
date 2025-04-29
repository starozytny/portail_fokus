import React, { useRef } from "react";
import PropTypes from 'prop-types';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sanitaze from "@commonFunctions/sanitaze";

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { ButtonIconDropdown } from "@tailwindComponents/Elements/Button";

const URL_DOCUMENT_ELEMENT = "intern_api_fokus_inventories_document";

export function InventoriesItem ({ elem, highlight, onModal, hasAi })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    let styleItemDropdown = "w-full inline-block px-2 py-1.5 cursor-pointer hover:bg-gray-100";

    let menu = [];
    if(elem.state === 0){
        menu = [
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
    }else{
        menu = [
            { data: <div className={styleItemDropdown} onClick={() => onModal("details", elem)}>
                    <span className="icon-vision" />
                    <span className="pl-1">Détails</span>
                </div> },
            { data: <a className={styleItemDropdown} href={Routing.generate(URL_DOCUMENT_ELEMENT, {id: elem.id})} target="_blank">
                    <span className="icon-file" />
                    <span className="pl-1">Document PDF</span>
                </a> },
        ]

        if(hasAi && (elem.uidEntryForAi || (elem.type === 0 && !elem.uidEntryForAi))){
            menu = [...menu, ...[{
                data: <div className={styleItemDropdown} onClick={() => onModal("aiCompare", elem)}>
                    <span className="icon-magicpen" />
                    <span className="pl-1">Comparateur par IA</span>
                </div>
            }]]
        }
    }

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <div className={`font-semibold text-sm ${elem.date === 0 ? "text-red-500" : ""}`}>
                        {elem.date === 0 ? "Indéfinie" : Sanitaze.timestampToDateForm(elem.date)}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">UID : {elem.uid}</div>
                </div>
                <div className="col-2">
                {elem.user
                    ? <>
                        <Badge type="gray">{elem.user.userTag}</Badge>
                        <div className="text-sm text-gray-600 mt-1">{elem.user.lastName} {elem.user.firstName}</div>
                    </>
                    : <div className="text-sm text-gray-600 mt-1">Inconnu</div>
                }

                </div>
                <div className="col-3 text-sm text-gray-600">
                    <Badge type={elem.type === 0 ? "red" : "green"}>
                        {elem.type === 0 ? "Sortant" : "Entrant"}
                    </Badge>
                    <div className="mt-1">
                        Structure :
                        {elem.input === 0
                            ? " EDL vierge"
                            : (elem.input > 0
                                ? " EDL précédent"
                                : " Modèle : " + elem.model.name
                            )
                        }
                    </div>
                </div>
                <div className="col-4 text-sm text-gray-600">
                    <div><u>Référence</u> : <span className="font-semibold">{elem.property.reference}</span></div>
                    <div>
                        <div>{elem.property.addr1}</div>
                        <div>{elem.property.addr2}</div>
                        <div>{elem.property.addr3}</div>
                        <div>{elem.property.zipcode} {elem.property.city}</div>
                    </div>
                    {elem.property.owner
                        ? <div className="mt-2">Propriétaire : {elem.property.owner}</div>
                        : null
                    }
                </div>
                <div className="col-5 text-sm text-gray-600">
                    {elem.tenantsData.length > 0
                        ? elem.tenantsData.map((tenant, index) => {
                            return <div key={index}>
                                - {tenant.lastName} {tenant.firstName}
                            </div>
                        })
                        : null
                    }
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
