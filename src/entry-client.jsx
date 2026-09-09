import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import "./index.css";
import "./styles/global.css";

const ssrData = window.__SSR_DATA__ || {};

hydrateRoot(
    document.getElementById("root"),
    <BrowserRouter>
        <App
            initialHero={ssrData.initialHero || null}
            initialProducts={ssrData.initialProducts || []}
            initialCategories={ssrData.initialCategories || []}
            initialIndustries={ssrData.initialIndustries || []}
            initialTopBar={ssrData.initialTopBar || null}
        />
    </BrowserRouter>
);