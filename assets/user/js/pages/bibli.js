import "../../css/pages/bibli.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Bibliotheque } from "@userPages/Bibli/Bibliotheque";

let el = document.getElementById("bibli_list");
if(el){
	createRoot(el).render(<Bibliotheque {...el.dataset} />)
}
