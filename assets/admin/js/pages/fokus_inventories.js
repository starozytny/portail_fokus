import "../../css/pages/fokus_inventories.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Properties } from "@adminPages/Fokus/Properties/Properties";

let el = document.getElementById("properties_list");
if(el){
    createRoot(el).render(<Properties {...el.dataset} isAssignation={false} />)
}
