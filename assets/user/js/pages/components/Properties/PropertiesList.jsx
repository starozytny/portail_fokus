import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { PropertiesItem } from "@userPages/Properties/PropertiesItem";

export function PropertiesList ({ data, propertiesSelected, highlight, onModal, onSelector }) {
    return <div className="list my-4">
        <div className="list-table bg-white rounded-md shadow">
            <div className="items items-properties">
                <div className="item item-header uppercase text-sm text-gray-600">
                    <div className="item-content">
                        <div className="item-infos">
                            <div className="col-1">Adresse</div>
                            <div className="col-2">Références</div>
                            <div className="col-3">Details</div>
                            <div className="col-4 actions" />
                        </div>
                    </div>
                </div>

                {data.length > 0
                    ? data.map((elem) => {
                        return <PropertiesItem key={elem.id} elem={elem} highlight={highlight} onModal={onModal}
                                               onSelector={onSelector} propertiesSelected={propertiesSelected} />
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

PropertiesList.propTypes = {
    data: PropTypes.array.isRequired,
    highlight: PropTypes.number,
}
