import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import IndustryCard from "../Industry/IndustryCard";
import SectionHeader from "../SectionHeader/SectionHeader";
import { getPublicIndustries } from "../../services/industryService";

import "./Industry.css";

function Industries() {
    const [industries, setIndustries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIndustries = async () => {
            try {
                const response = await getPublicIndustries();

console.log("INDUSTRY RESPONSE:", response);

                console.log(
                    "Public industries:",
                    response
                );

                setIndustries(
                    response.industries || []
                );

            } catch (error) {
                console.error(
                    "Failed to load industries:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchIndustries();
    }, []);

    if (loading) {
        return null;
    }

    return (
        <section
            className="industries"
            id="industries"
        >
            <div className="container">

                <SectionHeader
                    title="Industry"
                    highlight="Expertise"
                    subtitle="Tailored packaging solutions for every sector"
                />

                <div className="industry-layout">

                    {industries[0] && (
                        <IndustryCard
                            industry={industries[0]}
                        />
                    )}

                    <div className="right-column">

                        {industries[1] && (
                            <IndustryCard
                                industry={industries[1]}
                            />
                        )}

                        {industries[2] && (
                            <IndustryCard
                                industry={industries[2]}
                            />
                        )}

                    </div>

                    {industries[3] && (
                        <IndustryCard
                            industry={industries[3]}
                        />
                    )}

                    {industries[4] && (
                        <IndustryCard
                            industry={industries[4]}
                        />
                    )}

                </div>

                <div className="mobile-slider">
                    <Swiper>
                        {industries.map((industry) => (
                            <SwiperSlide
                                key={industry._id}
                            >
                                <IndustryCard
                                    industry={industry}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

            </div>
        </section>
    );
}

export default Industries;