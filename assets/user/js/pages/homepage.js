import "../../css/pages/homepage.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Agenda } from "@tailwindComponents/Modules/Agenda/Agenda";

let el = document.getElementById("agenda_list");
if(el){
	createRoot(el).render(<Agenda {...el.dataset} />)
}

