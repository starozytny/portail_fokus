import React, { useRef } from "react";
import PropTypes from 'prop-types';

import { setHighlightClass, useHighlight } from "@commonHooks/item";

import { ButtonIcon } from "@tailwindComponents/Elements/Button";

export function ModelsItem ({ elem, highlight, onModal })
{
    const refItem = useRef(null);

    let nHighlight = useHighlight(highlight, elem.id, refItem);

    let content = JSON.parse(elem.content);

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
                    <ButtonIcon type="default" icon="pencil" onClick={() => onModal('update', elem)}>Modifier</ButtonIcon>
                </div>
            </div>
        </div>
    </div>
}

ModelsItem.propTypes = {
    elem: PropTypes.object.isRequired,
    highlight: PropTypes.number,
}
