import "../../css/pages/property.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Properties } from "@userPages/Properties/Properties";

let el = document.getElementById("properties_list");
if(el){
	createRoot(el).render(<Properties {...el.dataset} />)
}
