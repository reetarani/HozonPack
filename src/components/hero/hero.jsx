import "./hero.css";
import { PiLeafFill } from "react-icons/pi";
import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/images/hero-box.png"; // your image

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-badge">
        <Leaf className="badge-icon" />
        <span>CUSTOM SOLUTIONS AVAILABLE</span>
        </div>
        <h1 className="hero-title">
          <span className="dark">Packaging</span>{" "}
          <span className="orange">that Performs</span>
        </h1>

        <p className="hero-description">
          Smart, sustainable, and high-strength corrugated solutions for
          businesses of every size.
        </p>

       <button
            className="hero-btn"
            onClick={() => {
                document
                    .getElementById("products")
                    ?.scrollIntoView({
                        behavior: "smooth",
                    });
            }}
        >
            Explore Our Range
        </button>

        <div className="hero-image">
          <img src={heroImage} alt="Packaging Boxes" />
        </div>

      </div>

    </section>
  );
}

export default Hero;