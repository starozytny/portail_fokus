import "../../css/pages/fokus_inventories.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Inventories } from "@adminPages/Fokus/Inventories/Inventories";

let el = document.getElementById("inventories_list");
if(el){
    createRoot(el).render(<Inventories {...el.dataset} />)
}
