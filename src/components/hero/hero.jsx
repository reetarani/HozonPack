import { useEffect, useState } from "react";

import "./hero.css";

import { getPublicHero } from "../../services/heroService";

function Hero() {

    const [hero, setHero] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchHero = async () => {

            try {

                const response =
                    await getPublicHero();

                if (response.success) {
                    setHero(response.hero);
                }

            } catch (error) {

                console.error(
                    "Failed to load hero:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchHero();

    }, []);


    if (loading) {
        return null;
    }


    if (!hero) {
        return null;
    }


    return (
        <section className="hero-section">

            <div className="hero-container">

                <div className="hero-content">

                    {/* Badge */}
                    {hero.badge && (
                        <div className="hero-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-leaf badge-icon" aria-hidden="true"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path></svg>{hero.badge}
                        </div>
                    )}


                    {/* Heading */}
                    <h1 className="hero-title">
                        {hero.title}{" "}

                        {hero.highlight && (
                            <span className="orange">
                                {hero.highlight}
                            </span>
                        )}
                    </h1>


                    {/* Description */}
                    {hero.subtitle && (
                        <p className="hero-description">
                            {hero.subtitle}
                        </p>
                    )}


                    {/* Button */}
                    {hero.buttonText && (
                      <button
                          type="button"
                          className="hero-btn"
                          onClick={() => {
                              const url = hero.buttonUrl?.trim();

                              if (!url) return;

                              // Scroll to section: #products
                              if (url.startsWith("#")) {
                                  const element = document.getElementById(
                                      url.substring(1)
                                  );

                                  if (element) {
                                      element.scrollIntoView({
                                          behavior: "smooth",
                                          block: "start",
                                      });
                                  }

                                  return;
                              }

                              // Normal URL
                              window.location.href = url;
                          }}
                      >
                          {hero.buttonText}
                      </button>
                  )}

                </div>


                {/* Hero Image */}
                {hero.image && (
                    <div className="hero-image">

                        <img
                            src={`http://localhost:5000${hero.image}`}
                            alt={
                                hero.title ||
                                "Packaging"
                            }
                        />

                    </div>
                )}

            </div>

        </section>
    );
}

export default Hero;