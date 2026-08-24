import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import SectionHeader from "../SectionHeader/SectionHeader";
import {
    getPublicTestimonials,
} from "../../services/testimonialService";

import "swiper/css";
import "swiper/css/pagination";

import "./TestimonialSlider.css";

function TestimonialSlider() {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response =
                    await getPublicTestimonials();

                if (response.success) {
                    setTestimonials(
                        response.testimonials || []
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load testimonials:",
                    error
                );
            }
        };

        fetchTestimonials();
    }, []);

    return (
        <section className="testimonial-section">

            <div className="container">

                <SectionHeader
                    title="Trusted by"
                    highlight="Industry Leaders"
                    subtitle="Hear what our clients say about working with us."
                />

                {testimonials.length > 0 && (
                    <Swiper
                        modules={[Pagination]}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        spaceBetween={30}
                        slidesPerView={1}
                        breakpoints={{
                            768: {
                                slidesPerView:
                                    Math.min(
                                        testimonials.length,
                                        2
                                    ),
                            },
                        }}
                    >
                        {testimonials.map((item) => (
                            <SwiperSlide
                                key={item._id}
                            >
                                <TestimonialCard
                                    item={item}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

            </div>

        </section>
    );
}

function TestimonialCard({ item }) {
    return (
        <div className="testimonial-card">

            <div className="testimonial-quote">
                "{item.message}"
            </div>

            <div className="testimonial-user">

                {item.image && (
                    <img
                        src={`http://localhost:5000${item.image}`}
                        alt={item.name}
                    />
                )}

                <div>
                    <h4>{item.name}</h4>

                    <span>
                        {item.designation}

                        {item.designation &&
                            item.company &&
                            ", "}

                        {item.company}
                    </span>
                </div>

            </div>

        </div>
    );
}

export default TestimonialSlider;