import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { CountersItem } from "@userPages/Bibli/Counters/CountersItem";

export function CountersList ({ data, rights, highlight, onModal }) {
    return <div className="list my-4">
        <div className="list-table bg-white rounded-md shadow">
            <div className="items items-counters">
                <div className="item item-header uppercase text-sm text-gray-600">
                    <div className="item-content">
                        <div className="item-infos">
                            <div className="col-1">Intitulé</div>
                            <div className="col-2">Unité</div>
                            <div className="col-3 actions" />
                        </div>
                    </div>
                </div>

                {data.length > 0
                    ? data.map((elem) => {
                        return <CountersItem key={elem.id} elem={elem} rights={rights} highlight={highlight} onModal={onModal} />
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

CountersList.propTypes = {
    data: PropTypes.array.isRequired,
    highlight: PropTypes.number,
}
