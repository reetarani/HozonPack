import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5174;
const API_URL = "http://localhost:5000/api";


/* =====================================================
   API HELPER
===================================================== */

async function getJson(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error(
                "SSR API ERROR:",
                response.status,
                response.statusText,
                url
            );

            return null;
        }

        return await response.json();

    } catch (error) {
        console.error("SSR FETCH FAILED:", url);
        console.error(error);

        return null;
    }
}


/* =====================================================
   SSR DATA
===================================================== */

async function getSSRData(pathname) {

    const slug =
        pathname === "/"
            ? "/"
            : pathname
                .split("/")
                .filter(Boolean)
                .pop();


    /* -----------------------------------------
       Page Detection
    ----------------------------------------- */

    const isHomePage =
        pathname === "/";

    const isProductsPage =
        pathname === "/products";


    /* -----------------------------------------
       Fetch SSR Data
    ----------------------------------------- */

    const [
        seoData,
        heroData,
        productsData,
        categoriesData,
        industriesData,
        topBarData,
    ] = await Promise.all([

        /* -------------------------------------
           SEO
        ------------------------------------- */

        getJson(
            `${API_URL}/public/seo-meta?slug=${encodeURIComponent(slug)}`
        ),


        /* -------------------------------------
           Hero
           Home page only
        ------------------------------------- */

        isHomePage
            ? getJson(
                `${API_URL}/public/hero`
            )
            : Promise.resolve(null),


        /* -------------------------------------
           Products
           Home + Products page
        ------------------------------------- */

        isHomePage || isProductsPage
            ? getJson(
                `${API_URL}/public/products`
            )
            : Promise.resolve(null),


        /* -------------------------------------
           Categories
           Home + Products page
        ------------------------------------- */

        isHomePage || isProductsPage
            ? getJson(
                `${API_URL}/public/categories`
            )
            : Promise.resolve(null),


        /* -------------------------------------
           Industries
           Home + Products page
        ------------------------------------- */

        isHomePage || isProductsPage
            ? getJson(
                `${API_URL}/public/industries`
            )
            : Promise.resolve(null),


        /* -------------------------------------
           Top Bar
           Global
        ------------------------------------- */

        getJson(
            `${API_URL}/topbar/public`
        ),
    ]);


    /* -----------------------------------------
       Return SSR Data
    ----------------------------------------- */

    return {

        seoMeta:
            seoData?.seoMeta || null,

        initialHero:
            heroData?.hero || null,

        initialProducts:
            productsData?.products || [],

        initialCategories:
            categoriesData?.categories || [],

        initialIndustries:
            industriesData?.industries || [],

        initialTopBar:
            topBarData?.topBar || null,
    };
}


/* =====================================================
   SERVER
===================================================== */

async function createServer() {

    const app = express();


    /* =================================================
       VITE
    ================================================= */

    const vite = await createViteServer({

        server: {
            middlewareMode: true,
        },

        appType: "custom",

    });


    /* =================================================
       SSR PAGE HANDLER

       IMPORTANT:
       SSR comes BEFORE vite.middlewares
    ================================================= */

    app.use(async (req, res, next) => {

        try {

            /* -----------------------------------------
               Only GET requests
            ----------------------------------------- */

            if (req.method !== "GET") {
                return next();
            }


            /* -----------------------------------------
               Skip assets / Vite internal requests
            ----------------------------------------- */

            if (
                req.url.startsWith("/@") ||
                req.url.startsWith("/src/") ||
                req.url.startsWith("/node_modules/") ||
                req.url.startsWith("/favicon") ||
                req.url.includes(".")
            ) {

                return next();

            }


            /* -----------------------------------------
               Current URL
            ----------------------------------------- */

            const url =
                req.originalUrl;


            /* -----------------------------------------
               Pathname
            ----------------------------------------- */

            const pathname =
                new URL(
                    url,
                    `http://localhost:${PORT}`
                ).pathname;


            /* -----------------------------------------
               Get SSR data
            ----------------------------------------- */

            const ssrData =
                await getSSRData(
                    pathname
                );


            /* -----------------------------------------
               Read index.html
            ----------------------------------------- */

            const templatePath =
                path.resolve(
                    __dirname,
                    "index.html"
                );


            let template =
                await fs.readFile(
                    templatePath,
                    "utf-8"
                );


            /* -----------------------------------------
               Vite HTML transformation
            ----------------------------------------- */

            template =
                await vite.transformIndexHtml(
                    url,
                    template
                );


            /* -----------------------------------------
               Load React SSR entry
            ----------------------------------------- */

            const { render } =
                await vite.ssrLoadModule(
                    "/src/entry-server.jsx"
                );


            /* -----------------------------------------
               Render React
            ----------------------------------------- */

            const appHtml =
                render(
                    pathname,
                    ssrData
                );


            /* =================================================
               SEO
            ================================================= */

            let seoHead = "";


            if (ssrData.seoMeta) {

                const seo =
                    ssrData.seoMeta;


                seoHead = `

<title>${escapeHtml(
    seo.metaTitle || ""
)}</title>

<meta
    name="description"
    content="${escapeHtml(
        seo.metaDescription || ""
    )}"
/>

<meta
    name="keywords"
    content="${escapeHtml(
        seo.metaKeywords || ""
    )}"
/>

<link
    rel="canonical"
    href="http://localhost:${PORT}${pathname}"
/>

<meta
    property="og:title"
    content="${escapeHtml(
        seo.metaTitle || ""
    )}"
/>

<meta
    property="og:description"
    content="${escapeHtml(
        seo.metaDescription || ""
    )}"
/>

`;

            }


            /* -----------------------------------------
               Replace SEO
            ----------------------------------------- */

            template =
                template.replace(
                    "<!--seo-head-->",
                    seoHead
                );


            /* -----------------------------------------
               Replace React SSR
            ----------------------------------------- */

            template =
                template.replace(
                    "<!--ssr-outlet-->",
                    appHtml
                );


            /* =================================================
               Serialize SSR Data
            ================================================= */

            const serializedSSRData =
                JSON.stringify(
                    ssrData
                )
                    .replace(
                        /</g,
                        "\\u003c"
                    )
                    .replace(
                        />/g,
                        "\\u003e"
                    )
                    .replace(
                        /&/g,
                        "\\u0026"
                    );


            template =
                template.replace(
                    "<!--ssr-data-->",
                    `<script>window.__SSR_DATA__=${serializedSSRData};</script>`
                );


            /* -----------------------------------------
               Send Response
            ----------------------------------------- */

            return res
                .status(200)
                .set({
                    "Content-Type":
                        "text/html; charset=utf-8",
                })
                .end(template);


        } catch (error) {

            console.error(
                "SSR ERROR:",
                error
            );


            vite.ssrFixStacktrace(
                error
            );


            return next(error);

        }

    });


    /* =================================================
       VITE MIDDLEWARE

       Handles:
       - @vite/client
       - React refresh
       - src files
       - CSS
       - JS
       - images
       - favicon
    ================================================= */

    app.use(
        vite.middlewares
    );


    /* =================================================
       START SERVER
    ================================================= */

    app.listen(
        PORT,
        "127.0.0.1",
        () => {

            console.log(
                `SSR frontend running on http://localhost:${PORT}`
            );

        }
    );

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   START
===================================================== */

createServer();