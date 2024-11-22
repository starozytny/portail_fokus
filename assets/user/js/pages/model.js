import "../../css/pages/model.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Models } from "@userPages/Models/Models";

let el = document.getElementById("models_list");
if(el){
	createRoot(el).render(<Models {...el.dataset} />)
}
