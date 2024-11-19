import "../../css/pages/administration_clients.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { Clients } from "@adminPages/Administration/Clients/Clients";

let el = document.getElementById("clients_list");
if(el){
    createRoot(el).render(<Clients {...el.dataset} />)
}
