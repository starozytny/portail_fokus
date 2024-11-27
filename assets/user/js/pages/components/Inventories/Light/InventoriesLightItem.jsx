import React from "react";
import PropTypes from 'prop-types';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Sanitaze from "@commonFunctions/sanitaze";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { ButtonIconA } from "@tailwindComponents/Elements/Button";

const URL_DOCUMENT_ELEMENT = "intern_api_fokus_inventories_document";

export function InventoriesLightItem ({ elem, property })
{
    return <div className="item border-t hover:bg-slate-50">
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1">
                    <div className={`font-semibold text-sm ${elem.date === 0 ? "text-red-500" : ""}`}>
                        {elem.date === 0 ? "Indéfinie" : Sanitaze.timestampToDateForm(elem.date)}
                    </div>
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
                <Badge type={elem.type === 0 ? "red" : "yellow"}>
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
                    {property
                        ? elem.tenantsData.length > 0
                            ? elem.tenantsData.map((tenant, index) => {
                                return <div key={index}>
                                    - {tenant.lastName} {tenant.firstName}
                                </div>
                            })
                            : null
                        : <>
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
                        </>
                    }
                </div>
                <div className="col-5 actions">
                    {elem.state !== 0
                        ? <ButtonIconA type="default" icon="file" tooltipWidth={96}
                                       onClick={Routing.generate(URL_DOCUMENT_ELEMENT, {id: elem.id})}>
                            Document PDF
                    </ButtonIconA>
                        : null
                    }
                </div>
            </div>
        </div>
    </div>
}

InventoriesLightItem.propTypes = {
    elem: PropTypes.object.isRequired,
}
