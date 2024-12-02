import React from "react";

import Sanitaze from "@commonFunctions/sanitaze";

import { Badge } from "@tailwindComponents/Elements/Badge";

import { BienData } from "@userPages/Biens/BienDetails";
import { TenantData } from "@userPages/Tenants/TenantDetails";

export function InventoryDetails ({ elem }) {
    console.log(elem);
    return <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
        <div>
            <div className="bg-white border rounded-md">
                <div className="text-lg font-semibold border-b px-4 pt-2 pb-1 bg-color0 rounded-t-md text-white">
                    État des lieux
                </div>
                <div className="p-4 flex flex-col gap-2">
                    <div>
                        <Badge type={elem.type === 0 ? "red" : "yellow"}>
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

                <BienData elem={elem.property} currentTenant={null} />
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
                                    <TenantData elem={tenant} />
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
