import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { NaturesItem } from "@userPages/Bibli/Natures/NaturesItem";

export function NaturesList ({ data, rights, highlight, onModal }) {
    return <div className="list my-4">
        <div className="list-table bg-white rounded-md shadow">
            <div className="items items-natures">
                <div className="item item-header uppercase text-sm text-gray-600">
                    <div className="item-content">
                        <div className="item-infos">
                            <div className="col-1">Intitulé</div>
                            <div className="col-2 actions" />
                        </div>
                    </div>
                </div>

                {data.length > 0
                    ? data.map((elem) => {
                        return <NaturesItem key={elem.id} elem={elem} rights={rights} highlight={highlight} onModal={onModal} />
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

NaturesList.propTypes = {
    data: PropTypes.array.isRequired,
    highlight: PropTypes.number,
}
