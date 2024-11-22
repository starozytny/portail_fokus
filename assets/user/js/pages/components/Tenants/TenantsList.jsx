import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { TenantsItem } from "@userPages/Tenants/TenantsItem";

export function TenantsList ({ data, highlight, onModal }) {
    return <div className="list my-4">
        <div className="list-table bg-white rounded-md shadow">
            <div className="items items-tenants">
                <div className="item item-header uppercase text-sm text-gray-600">
                    <div className="item-content">
                        <div className="item-infos">
                            <div className="col-1">Locataire</div>
                            <div className="col-2">Référence</div>
                            <div className="col-3">Adresse</div>
                            <div className="col-4 actions" />
                        </div>
                    </div>
                </div>

                {data.length > 0
                    ? data.map((elem) => {
                        return <TenantsItem key={elem.id} elem={elem} highlight={highlight} onModal={onModal} />
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

TenantsList.propTypes = {
    data: PropTypes.array.isRequired,
    highlight: PropTypes.number,
}
