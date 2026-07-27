import testimonials from "../../data/testimonials";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import SectionHeader from "../SectionHeader/SectionHeader";

import "swiper/css";
import "swiper/css/pagination";

import "./TestimonialSlider.css";

function TestimonialSlider() {
  const isSlider = testimonials.length > 2;

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">

        <SectionHeader
          title="Trusted by"
          highlight="Industry Leaders"
          subtitle="Hear what our clients say about working with us."
        />
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
            slidesPerView: Math.min(testimonials.length, 2),
            },
        }}
        >
        {testimonials.map((item) => (
            <SwiperSlide key={item.id}>
            <TestimonialCard item={item} />
            </SwiperSlide>
        ))}
        </Swiper>
      </div>
    </section>
  );
}

function TestimonialCard({ item }) {
  return (
    <div className="testimonial-card">
      <p>"{item.quote}"</p>

      <div className="testimonial-user">
        <img src={item.image} alt={item.name} />

        <div>
          <h4>{item.name}</h4>
          <span>
            {item.designation}, {item.company}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TestimonialSlider;