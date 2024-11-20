import '../css/app.scss';

const routes = require('@publicFolder/js/fos_js_routes.json');
import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min';

import React from 'react';
import { createRoot } from "react-dom/client";

import Menu from "@tailwindFunctions/menu";
import { Credits } from "./components/Modules/Credits/Credits";

Routing.setRoutingData(routes);

Menu.menuListener();

const credits = document.getElementById("credits");
if(credits){
	createRoot(credits).render(<Credits {...credits.dataset} />)
}

