import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";

import App from "./App";

export function render(url, data = {}) {
    return renderToString(
        <StaticRouter location={url}>
            <App
                initialHero={data.initialHero || null}
                initialProducts={data.initialProducts || []}
                initialCategories={data.initialCategories || []}
                initialIndustries={data.initialIndustries || []}
                initialTopBar={data.initialTopBar || null}
            />
        </StaticRouter>
    );
}