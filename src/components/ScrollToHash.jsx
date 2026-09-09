import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToHash() {
    const location = useLocation();

    useEffect(() => {
        if (!location.hash) return;

        const hash = location.hash.substring(1);

        let attempts = 0;
        const maxAttempts = 30;

        const scrollToTarget = () => {
            const element = document.getElementById(hash);

            if (!element) {
                attempts++;

                if (attempts < maxAttempts) {
                    setTimeout(scrollToTarget, 100);
                }

                return;
            }

            // Contact should go to the very bottom
            if (hash === "contact") {
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: "smooth",
                });

                return;
            }

            // Other sections
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        };

        // Wait for SSR/client content
        setTimeout(scrollToTarget, 100);

        return () => {
            attempts = maxAttempts;
        };
    }, [location.pathname, location.hash]);

    return null;
}

export default ScrollToHash;