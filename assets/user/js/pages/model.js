import "../../css/pages/model.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Tenants } from "@userPages/Tenants/Tenants";

let el = document.getElementById("tenants_list");
if(el){
	createRoot(el).render(<Tenants {...el.dataset} />)
}
