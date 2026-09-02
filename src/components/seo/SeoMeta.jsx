import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import {
    getPublicSeoMeta,
} from "../../services/publicSeoService";

function SeoMeta() {
    const location = useLocation();

    useEffect(() => {
        const loadSeoMeta = async () => {
            try {
                const pathname = location.pathname || "/";

                // Home page uses "/" as the SEO slug
                const slug =
                    pathname === "/"
                        ? "/"
                        : pathname
                            .split("/")
                            .filter(Boolean)
                            .pop();

                console.log("SEO pathname:", pathname);
                console.log("SEO slug:", slug);

                const response =
                    await getPublicSeoMeta(slug);

                if (
                    !response.success ||
                    !response.seoMeta
                ) {
                    return;
                }

                const seo = response.seoMeta;

                // -------------------------
                // TITLE
                // -------------------------
                if (seo.metaTitle) {
                    document.title = seo.metaTitle;
                }

                // -------------------------
                // DESCRIPTION
                // -------------------------
                if (seo.metaDescription) {
                    let description =
                        document.querySelector(
                            'meta[name="description"]'
                        );

                    if (!description) {
                        description =
                            document.createElement("meta");

                        description.setAttribute(
                            "name",
                            "description"
                        );

                        document.head.appendChild(
                            description
                        );
                    }

                    description.setAttribute(
                        "content",
                        seo.metaDescription
                    );
                }

                // -------------------------
                // KEYWORDS
                // -------------------------
                if (seo.metaKeywords) {
                    let keywords =
                        document.querySelector(
                            'meta[name="keywords"]'
                        );

                    if (!keywords) {
                        keywords =
                            document.createElement("meta");

                        keywords.setAttribute(
                            "name",
                            "keywords"
                        );

                        document.head.appendChild(
                            keywords
                        );
                    }

                    keywords.setAttribute(
                        "content",
                        seo.metaKeywords
                    );
                }

            } catch (error) {
                // SEO settings are optional
                console.warn(
                    "SEO meta not available:",
                    error
                );
            }
        };

        loadSeoMeta();
    }, [location.pathname]);

    return null;
}

export default SeoMeta;