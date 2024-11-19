import React, { useRef } from "react";
import PropTypes from 'prop-types';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { Badge } from "@tailwindComponents/Elements/Badge";

export function UsersItem ({ elem, highlight })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1 flex flex-row gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                        <div className="h-full w-full rounded-md bg-gray-300 flex items-center justify-center font-semibold">
                            {elem.lastName.slice(0, 1) + elem.firstName.slice(0, 1)}
                        </div>
                    </div>
                    <div className="leading-4">
                        <div className={"font-medium mb-1" + (elem.isBlocked ? " blocked" : "")}>
                            <span>{elem.lastName} {elem.firstName}</span>
                            {elem.isBlocked ? <span className="icon-disabled" title="Bloqué" /> : null}
                        </div>
                        {/*<div className="text-gray-600">{elem.society.code} - {elem.society.name}</div>*/}
                    </div>
                </div>
                <div className="col-2 leading-5">
                    <div className={elem.isBlocked ? "blocked" : ""}>{elem.username}</div>
                    <div className="text-gray-600 text-sm">{elem.email}</div>
                </div>
                <div className="col-3">
                    <Badge type={elem.isBlocked ? "red" : "blue"}>
                        {elem.userTag} {elem.isBlocked ? <span className="icon-disabled pl-1" title="Bloqué" /> : ""}
                    </Badge>
                </div>
                <div className="col-4 actions">
                </div>
            </div>
        </div>
    </div>
}

UsersItem.propTypes = {
    elem: PropTypes.object.isRequired,
    highlight: PropTypes.number,
}
