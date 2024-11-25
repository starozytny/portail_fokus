import React, { useRef } from "react";
import PropTypes from 'prop-types';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { Badge } from "@tailwindComponents/Elements/Badge";
import { ButtonIcon } from "@tailwindComponents/Elements/Button";

export function RoomsItem ({ elem, highlight, onModal, roomsSelected, onAddRoom })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    let styleInput = "group-hover/item:ring-blue-700 relative w-5 h-5 cursor-pointer py-2 pl-2 rounded-md border-0 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500";
    let styleCheck = "absolute top-0.5 left-0.5 w-4 h-4 opacity-0 rounded bg-blue-700 flex items-center justify-center";
    let isChecked = false;

    if(onAddRoom){
        roomsSelected.forEach(r => {
            if(r.id === elem.id){
                isChecked = true;
            }
        })
    }

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className={`col-1 ${onAddRoom ? "cursor-pointer flex items-center gap-2 text-gray-900 group/item" : ""}`}
                     onClick={onAddRoom ? () => onAddRoom(elem.id) : null}
                >
                    {onAddRoom
                        ? <div className={`${styleInput} ${isChecked ? "ring-blue-700" : "ring-gray-300"}`}>
                            <div className={`${styleCheck} ${isChecked ? "opacity-100" : "opacity-0"}`}>
                                <span className="icon-check1 text-slate-50 text-xs"></span>
                            </div>
                        </div>
                        : null
                    }
                    <div className="font-medium">{elem.name}</div>
                </div>
                <div className="col-2 actions">
                    {onAddRoom
                        ? null
                        : (elem.isNative || elem.isUsed
                                ? <Badge type={elem.isNative ? "indigo" : "blue"}>{elem.isNative ? "Natif" : "Utilisé"}</Badge>
                            : <>
                                <ButtonIcon type="default" icon="pencil" onClick={() => onModal('form', elem)}>Modifier</ButtonIcon>
                                <ButtonIcon type="default" icon="trash" onClick={() => onModal('delete', elem)}>Supprimer</ButtonIcon>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    </div>
}

RoomsItem.propTypes = {
    elem: PropTypes.object.isRequired,
    highlight: PropTypes.number,
}
