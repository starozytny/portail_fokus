import React from "react";

import { InventoriesLight } from "@userPages/Inventories/Light/InventoriesLight";

export function BienDetails ({ elem, users, models, tenants }) {

    return <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:col-span-2">
            <div className="bg-white border rounded-md">
                <div className="text-lg font-semibold border-b px-4 pt-2 pb-1 bg-color0 rounded-t-md text-white">
                    Bien
                </div>
                <BienData elem={elem} currentTenant={elem.currentTenant} />
            </div>
            <div className="bg-white border rounded-md">
                <div className="text-lg font-semibold border-b px-4 pt-2 pb-1 bg-color0 rounded-t-md text-white">
                    États des lieux
                </div>
                <div className="p-4">
                    <InventoriesLight donnees={elem.inventories} property={elem} users={users} models={models} tenants={tenants} />
                </div>
            </div>
        </div>
    </div>
}

export function BienData ({ elem, currentTenant }) {
    return <div className="p-4 flex flex-col gap-2 divide-y lg:divide-y-0 lg:divide-x lg:flex-row">
        <div className="w-full">
            <div><u>Référence</u> : <span className="font-semibold">{elem.reference}</span></div>
            <div>
                <div>{elem.addr1}</div>
                <div>{elem.addr2}</div>
                <div>{elem.addr3}</div>
                <div>{elem.zipcode} {elem.city}</div>
            </div>
            {elem.owner
                ? <div className="mt-2">Propriétaire : {elem.owner}</div>
                : null
            }
            <div>Actuel locataire : {currentTenant ? <DisplayTenant tenant={currentTenant} /> : "Non renseigné"}</div>
        </div>
        <div className="w-full pt-2 lg:pt-0 lg:pl-4">
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
    </div>
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
