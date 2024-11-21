import "../../css/pages/profil.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { ProfilFormulaire } from "./components/Profil/ProfilForm";

let el = document.getElementById("profil_update");
if(el){
	createRoot(el).render(<ProfilFormulaire context="update" element={JSON.parse(el.dataset.element)} />)
}
