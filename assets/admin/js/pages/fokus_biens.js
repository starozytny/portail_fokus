import React from "react";
import { createRoot } from "react-dom/client";
import { Biens } from "@adminPages/Fokus/Biens/Biens";

let el = document.getElementById("biens_list");
if(el){
    createRoot(el).render(<Biens {...el.dataset} />)
}
