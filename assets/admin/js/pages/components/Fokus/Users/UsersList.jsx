import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { UsersItem } from "@adminPages/Fokus/Users/UsersItem";

export function UsersList ({ data, highlight }) {
    return <div className="list my-4">
        <div className="list-table bg-white rounded-md shadow">
            <div className="items items-users">
                <div className="item item-header uppercase text-sm text-gray-600">
                    <div className="item-content">
                        <div className="item-infos">
                            <div className="col-1">Utilisateur</div>
                            <div className="col-2">Identifiant</div>
                            <div className="col-3">User tag</div>
                            <div className="col-4 actions" />
                        </div>
                    </div>
                </div>

                {data.length > 0
                    ? data.map((elem) => {
                        return <UsersItem key={elem.societyCode + elem.id} elem={elem} highlight={highlight} />;
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

UsersList.propTypes = {
    data: PropTypes.array.isRequired,
    highlight: PropTypes.number,
}
