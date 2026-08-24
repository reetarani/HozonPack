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
                const pathname =
                    location.pathname || "/";

                const response =
                    await getPublicSeoMeta(
                        pathname
                    );

                if (
                    !response.success ||
                    !response.seoMeta
                ) {
                    return;
                }

                const seo =
                    response.seoMeta;

                // Title
                if (seo.metaTitle) {
                    document.title =
                        seo.metaTitle;
                }

                // Description
                if (
                    seo.metaDescription
                ) {
                    let description =
                        document.querySelector(
                            'meta[name="description"]'
                        );

                    if (!description) {
                        description =
                            document.createElement(
                                "meta"
                            );

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

                // Keywords
                if (seo.metaKeywords) {
                    let keywords =
                        document.querySelector(
                            'meta[name="keywords"]'
                        );

                    if (!keywords) {
                        keywords =
                            document.createElement(
                                "meta"
                            );

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
                // 404 is okay if a page has no SEO settings
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