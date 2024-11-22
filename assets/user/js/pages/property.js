import "../../css/pages/property.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Biens } from "@userPages/Biens/Biens";

let el = document.getElementById("properties_list");
if(el){
	createRoot(el).render(<Biens {...el.dataset} />)
}
