import React, { useRef } from "react";
import PropTypes from 'prop-types';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { ButtonIconDropdown } from "@tailwindComponents/Elements/Button";

export function ModelsItem ({ elem, highlight, onModal })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    let styleItemDropdown = "w-full inline-block px-2 py-1.5 cursor-pointer hover:bg-gray-100";

    let menu = [
        { data: <div className={styleItemDropdown} onClick={() => onModal("details", elem)}>
                <span className="icon-vision" />
                <span className="pl-1">Détails</span>
            </div> },
        { data: <div className={styleItemDropdown} onClick={() => onModal("duplicate", elem)}>
                <span className="icon-copy" />
                <span className="pl-1">Dupliquer</span>
            </div> },
        { data: <div className={styleItemDropdown} onClick={() => onModal("form", elem)}>
                <span className="icon-pencil" />
                <span className="pl-1">Modifier</span>
            </div> },
        { data: <div className={styleItemDropdown} onClick={() => onModal("delete", elem)}>
                <span className="icon-trash" />
                <span className="pl-1">Supprimer</span>
            </div> },
    ]

    let content = elem.content ? JSON.parse(elem.content) : [];

    return <div className={`item${setHighlightClass(nHighlight)} border-t hover:bg-slate-50`} ref={refItem}>
        <div className="item-content">
            <div className="item-infos">
                <div className="col-1 cursor-pointer" onClick={() => onModal('details', elem)}>
                    <div className="font-medium">{elem.name}</div>
                </div>
                <div className="col-2 cursor-pointer" onClick={() => onModal('details', elem)}>
                    {content.length > 0
                        ? <div>
                            <div>{content.length} pièce{content.length > 1 ? "s" : ""}</div>
                        </div>
                        : null
                    }
                </div>
                <div className="col-3 actions">
                    <ButtonIconDropdown icon="more" items={menu} />
                </div>
            </div>
        </div>
    </div>
}

ModelsItem.propTypes = {
    elem: PropTypes.object.isRequired,
    highlight: PropTypes.number,
}
