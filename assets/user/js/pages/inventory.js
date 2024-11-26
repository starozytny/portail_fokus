import "../../css/pages/inventory.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Inventories } from "@userPages/Inventories/Inventories";

let el = document.getElementById("inventories_list");
if(el){
	createRoot(el).render(<Inventories {...el.dataset} />)
}
