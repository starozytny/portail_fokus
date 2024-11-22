import "../../css/pages/profil.scss"

import React from "react";
import { createRoot } from "react-dom/client";
import { ProfilFormulaire } from "@userPages/Profil/ProfilForm";
import { Users } from "@userPages/Profil/Users";

let el = document.getElementById("profil_update");
if(el){
	createRoot(el).render(<ProfilFormulaire context="update" element={JSON.parse(el.dataset.element)}
											withModal={false} identifiant={null} />)
}

let users = document.getElementById("profil_users");
if(users){
	createRoot(users).render(<Users {...el.dataset} />)
}
