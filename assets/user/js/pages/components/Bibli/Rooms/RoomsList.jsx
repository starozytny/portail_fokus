import React from "react";
import PropTypes from 'prop-types';

import { Alert } from "@tailwindComponents/Elements/Alert";

import { RoomsItem } from "@userPages/Bibli/Rooms/RoomsItem";

export function RoomsList ({ data, highlight, onModal, roomsSelected, onAddRoom }) {
    return <div className="list my-4">
        <div className="list-table bg-white rounded-md shadow">
            <div className="items items-rooms">
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
                        return <RoomsItem key={elem.id} elem={elem} roomsSelected={roomsSelected} highlight={highlight}
                                          onModal={onModal} onAddRoom={onAddRoom} />
                    })
                    : <div className="item border-t">
                        <Alert type="gray">Aucun résultat.</Alert>
                    </div>
                }
            </div>
        </div>
    </div>
}

RoomsList.propTypes = {
    data: PropTypes.array.isRequired,
    highlight: PropTypes.number,
}
