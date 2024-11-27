import React from "react";

import Sanitaze from "@commonFunctions/sanitaze";

import { Badge } from "@tailwindComponents/Elements/Badge";

export function InventoryDetails ({ elem }) {
    let property = elem.property;

    return <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
        <div>
            <div className="bg-white border rounded-md">
                <div className="text-lg font-semibold border-b px-4 pt-2 pb-1 bg-color0 rounded-t-md text-white">
                    État des lieux
                </div>
                <div className="p-4 flex flex-col gap-2">
                    <div>
                        <Badge type={elem.type === 0 ? "red" : "green"}>
                            {elem.type === 0 ? "Sortant" : "Entrant"}
                        </Badge>
                    </div>
                    <div className={`font-semibold text-sm ${elem.date === 0 ? "text-red-500" : ""}`}>
                        <span className="icon-calendar"></span> <span>{elem.date === 0 ? "Indéfinie" : Sanitaze.timestampToDateForm(elem.date)}</span>
                    </div>
                    <div>
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
                    <div className="mt-4 pt-6 border-t">
                        {elem.user
                            ? <>
                                <Badge type="gray">{elem.user.userTag}</Badge>
                                <div className="text-sm text-gray-600 mt-1">{elem.user.lastName} {elem.user.firstName}</div>
                            </>
                            : <div className="text-sm text-gray-600 mt-1">Inconnu</div>
                        }
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-4 md:col-span-2">
            <div className="bg-white border rounded-md">
                <div className="text-lg font-semibold border-b px-4 pt-2 pb-1 bg-color0 rounded-t-md text-white">
                    Bien
                </div>
                <div className="p-4 flex flex-col gap-2 divide-y lg:divide-y-0 lg:divide-x lg:flex-row">
                    <div className="w-full">
                        <div><u>Référence</u> : <span className="font-semibold">{property.reference}</span></div>
                        <div>
                            <div>{property.addr1}</div>
                            <div>{property.addr2}</div>
                            <div>{property.addr3}</div>
                            <div>{property.zipcode} {property.city}</div>
                        </div>
                        {property.owner
                            ? <div className="mt-2">Propriétaire : {property.owner}</div>
                            : null
                        }
                    </div>
                    <div className="w-full pt-2 lg:pt-0 lg:pl-4">
                        {property.building && <div>Bâtiment : {property.building}</div>}
                        {property.type && <div>Type : {property.type}</div>}
                        {property.isFurnished && parseInt(property.isFurnished) !== 0 && <div>Meublé</div>}

                        {property.door || (elem.floor !== "" && elem.floor !== "0")
                            ? <div className="flex gap-4">
                                {property.door && <div>Porte : {property.door}</div>}
                                {property.floor !== "" && elem.floor !== "0" && <div>Étage : {elem.floor}</div>}
                            </div>
                            : null
                        }
                        {parseInt(property.surface) > 0 && <div>{property.surface} m²</div>}
                        {parseInt(property.rooms) !== 0 && <div>{property.rooms} {parseInt(property.rooms) > 1 ? "pièces" : "pièce"}</div>}
                    </div>
                </div>
            </div>
            <div className="bg-white border rounded-md">
                <div className="text-lg font-semibold border-b px-4 pt-2 pb-1 bg-color0 rounded-t-md text-white">
                    Locataire{elem.tenantsData.length > 1 ? "s" : ""}
                </div>
                <div className="px-4">
                    {elem.tenantsData.length > 0
                        ? <div className="flex flex-col divide-y">
                            {elem.tenantsData.map((tenant, index) => {
                                return <div className="py-4" key={index}>
                                    <div><u>Référence</u> : <span className="font-medium">{tenant.reference}</span></div>
                                    <div>{tenant.lastName} {tenant.firstName}</div>
                                    <div>
                                        <div>{tenant.phone}</div>
                                        <div>{tenant.email ? tenant.email.split(';').map((it, index) => {
                                            return <div key={index}>{it}</div>
                                        }) : null}</div>
                                    </div>
                                    <div>
                                        <div>
                                            <div>{tenant.addr1}</div>
                                            <div>{tenant.addr2}</div>
                                            <div>{tenant.addr3}</div>
                                        </div>
                                        <div>{tenant.zipcode} {tenant.city}</div>
                                    </div>
                                </div>
                            })}
                        </div>
                        : null
                    }
                </div>
            </div>
        </div>
    </div>
}
