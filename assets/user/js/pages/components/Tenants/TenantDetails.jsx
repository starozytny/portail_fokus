import React from "react";

import { InventoriesLight } from "@userPages/Inventories/Light/InventoriesLight";

export function Tenantetails ({ elem, users, models, tenants, properties }) {
    return <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:col-span-2">
            <div className="bg-white border rounded-md">
                <div className="text-lg font-semibold border-b px-4 pt-2 pb-1 bg-color0 rounded-t-md text-white">
                    Locataire
                </div>
                <div className="p-4">
                    <TenantData elem={elem} />
                </div>
            </div>
            <div className="bg-white border rounded-md">
                <div className="text-lg font-semibold border-b px-4 pt-2 pb-1 bg-color0 rounded-t-md text-white">
                    États des lieux
                </div>
                <div className="p-4">
                    <InventoriesLight donnees={elem.inventories} property={null} users={users} models={models} tenants={tenants} properties={properties} />
                </div>
            </div>
        </div>
    </div>
}

export function TenantData ({ elem }) {
    return <div className="flex flex-col gap-2 divide-y lg:divide-y-0 lg:divide-x lg:flex-row">
        <div className="w-full">
            <div><u>Référence</u> : <span className="font-medium">{elem.reference}</span></div>
            <div>{elem.lastName} {elem.firstName}</div>
            <div>
                <div>{elem.phone}</div>
                <div>{elem.email ? elem.email.split(';').map((it, index) => {
                    return <div key={index}>{it}</div>
                }) : null}</div>
            </div>
        </div>
        <div className="w-full pt-2 lg:pt-0 lg:pl-4">
            <div>
                <div>{elem.addr1}</div>
                <div>{elem.addr2}</div>
                <div>{elem.addr3}</div>
            </div>
            <div>{elem.zipcode} {elem.city}</div>
        </div>
    </div>
}
