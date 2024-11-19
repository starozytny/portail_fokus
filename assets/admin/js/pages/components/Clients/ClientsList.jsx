import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { ClientsItem } from "@adminPages/Clients/ClientsItem";

export function ClientsList ({ data, highlight }) {
    return <div className="list my-4">
        <div className="list-table bg-white rounded-md shadow">
            <div className="items items-clients">
                <div className="item item-header uppercase text-sm text-gray-600">
                    <div className="item-content">
                        <div className="item-infos">
                            <div className="col-1">Société</div>
                            <div className="col-2">Manager</div>
                            <div className="col-3">Crédits</div>
                            <div className="col-4 actions" />
                        </div>
                    </div>
                </div>

                {data.length > 0
                    ? data.map((elem) => {
                        return <ClientsItem key={elem.id} elem={elem} highlight={highlight} />;
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

ClientsList.propTypes = {
    data: PropTypes.array.isRequired,
    highlight: PropTypes.number,
}
