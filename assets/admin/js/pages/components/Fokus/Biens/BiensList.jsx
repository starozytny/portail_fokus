import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { BiensItem } from "@adminPages/Fokus/Biens/BiensItem";

export function BiensList ({ data, highlight }) {
    return <div className="list my-4">
        <div className="list-table bg-white rounded-md shadow">
            <div className="items items-properties">
                <div className="item item-header uppercase text-sm text-gray-600">
                    <div className="item-content">
                        <div className="item-infos">
                            <div className="col-1">Adresse</div>
                            <div className="col-2">Informations</div>
                            <div className="col-3">Dernier EDL Uid</div>
                            <div className="col-4 actions" />
                        </div>
                    </div>
                </div>

                {data.length > 0
                    ? data.map((elem) => {
                        return <BiensItem key={elem.id} elem={elem} highlight={highlight} />;
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

BiensList.propTypes = {
    data: PropTypes.array.isRequired,
    highlight: PropTypes.number,
}
