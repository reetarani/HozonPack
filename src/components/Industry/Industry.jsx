import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import IndustryCard from "../Industry/IndustryCard";
import SectionHeader from "../SectionHeader/SectionHeader";
import industries from "../../data/industries";

import "./Industry.css";
function Industries() {
    
    return (
    
        <section className="industries" id="industries">
            <div className="container">
                <SectionHeader
                title="Industry"
                highlight="Expertise"
                subtitle="Tailored packaging solutions for every sector"
                />

                <div className="industry-layout">
                <IndustryCard industry={industries[0]} />
                <div className="right-column">
                    <IndustryCard industry={industries[1]} />
                    <IndustryCard industry={industries[2]} />
                </div>
                <IndustryCard industry={industries[3]} />
                <IndustryCard industry={industries[4]} />
                </div>
                
                <div className="mobile-slider">
                    <Swiper>
                        {industries.map((industry) => (
                            <SwiperSlide key={industry.id}>
                                <IndustryCard industry={industry} />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
            </div>
           
        </section>
    );
}

export default Industries;