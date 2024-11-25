import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { ElementsItem } from "@userPages/Bibli/Elements/ElementsItem";

export function ElementsList ({ data, highlight, onModal }) {
    return <div className="list my-4">
        <div className="list-table bg-white rounded-md shadow">
            <div className="items items-elements">
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
                        return <ElementsItem key={elem.id} elem={elem} highlight={highlight} onModal={onModal} />
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

ElementsList.propTypes = {
    data: PropTypes.array.isRequired,
    highlight: PropTypes.number,
}
