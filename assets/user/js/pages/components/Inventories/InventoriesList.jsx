import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { InventoriesItem } from "@userPages/Inventories/InventoriesItem";

export function InventoriesList ({ data, highlight, onModal, hasAi }) {
    return <div className="list my-4">
        <div className="list-table bg-white rounded-md shadow">
            <div className="items items-inventories">
                <div className="item item-header uppercase text-sm text-gray-600">
                    <div className="item-content">
                        <div className="item-infos">
                            <div className="col-1">Date</div>
                            <div className="col-2">Attribution</div>
                            <div className="col-3">Type</div>
                            <div className="col-4">Bien</div>
                            <div className="col-5">Locataire.s</div>
                            <div className="col-6 actions" />
                        </div>
                    </div>
                </div>

                {data.length > 0
                    ? data.map((elem) => {
                        return <InventoriesItem key={elem.id} elem={elem} highlight={highlight} onModal={onModal} hasAi={hasAi} />
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

InventoriesList.propTypes = {
    data: PropTypes.array.isRequired,
    highlight: PropTypes.number,
}
