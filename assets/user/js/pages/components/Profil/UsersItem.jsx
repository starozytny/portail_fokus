import React, { useRef } from "react";
import PropTypes from 'prop-types';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { ButtonIconDropdown } from "@tailwindComponents/Elements/Button";

export function UsersItem ({ elem, highlight, onModal })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    let styleItemDropdown = "w-full inline-block px-2 py-1.5 cursor-pointer hover:bg-gray-100";

    let menu = [
        { data: <div className={styleItemDropdown} onClick={() => onModal("form", elem)}>
            <span className="icon-pencil" />
            <span className="pl-1">Modifier</span>
        </div> },
    ]

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1 flex flex-row gap-4">
                    <div className="hidden xl:block w-16 h-16 rounded-md overflow-hidden">
                        <div className="h-full w-full rounded-md bg-gray-300 flex items-center justify-center font-semibold">
                            {elem.userTag}
                        </div>
                    </div>
                    <div className="leading-4">
                        <div className={"font-medium mb-1" + (!elem.isBlocked ? " blocked" : "")}>
                            <span>{elem.lastName} {elem.firstName}</span>
                            {!elem.isBlocked ? <span className="icon-disabled" title="Bloqué" /> : null}
                        </div>
                    </div>
                </div>
                <div className="col-2 leading-5">
                    <div className={!elem.isBlocked ? "blocked" : ""}>{elem.username}</div>
                    <div className="text-gray-600 text-sm">{elem.email}</div>
                </div>
                <div className="col-3">
                    <Badge type={!elem.isBlocked ? "red" : getBadgeType(elem.rights)}>
                        {elem.rightsString} {!elem.isBlocked ? <span className="icon-disabled pl-1" title="Bloqué" /> : ""}
                    </Badge>
                </div>
                <div className="col-4 actions">
                    {elem.rights !== 1
                        ? <ButtonIconDropdown icon="more" items={menu} />
                        : null
                    }

                </div>
            </div>
        </div>
    </div>
}

UsersItem.propTypes = {
    elem: PropTypes.object.isRequired,
    highlight: PropTypes.number,
}


function getBadgeType (type) {
    const badges = ["gray", "indigo", "yellow"];
    return badges[type];
}
