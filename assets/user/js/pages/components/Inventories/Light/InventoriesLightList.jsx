import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { InventoriesLightItem } from "@userPages/Inventories/Light/InventoriesLightItem";

export function InventoriesLightList ({ data, property }) {
    return <div className="list my-4">
        <div className="list-table">
            <div className="items items-inventories-light">
                <div className="item item-header uppercase text-sm text-gray-600">
                    <div className="item-content">
                        <div className="item-infos">
                            <div className="col-1">Date</div>
                            <div className="col-2">Attribution</div>
                            <div className="col-3">Type</div>
                            <div className="col-4">Bien</div>
                            <div className="col-5 actions" />
                        </div>
                    </div>
                </div>

                {data.length > 0
                    ? data.map((elem) => {
                        return <InventoriesLightItem key={elem.id} elem={elem} property={property} />
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

InventoriesLightList.propTypes = {
    data: PropTypes.array.isRequired,
}
