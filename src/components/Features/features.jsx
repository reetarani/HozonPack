import "./features.css";

import {
  FiTruck,
  FiPackage,
  FiDollarSign,
} from "react-icons/fi";

function Features() {

  const features = [
    {
      icon: <FiTruck />,
      title: "Fast delivery",
      desc: "Premium materials and rigorous quality control ensure every box meets the highest standards.",
    },
    {
      icon: <FiPackage />,
      title: "Less MOQ",
      subtitle: "| Minimum order quantity |",
      desc: "From standard sizes to bespoke designs, we tailor solutions to your exact specifications.",
    },
    {
      icon: <FiDollarSign />,
      title: "Competitive Pricing",
      desc: "Our packaging specialists guide you through material selection and design optimization.",
    },
  ];

  return (
    <section className="features">
        <div className="container">
      <div className="features-grid">
        {features.map((item, index) => (

          <div className="feature-card" key={index}>

            <div className="feature-icon">
              {item.icon}
            </div>

            <h3 className="feature-title">
              {item.title}

              {item.subtitle && (
                <span>{item.subtitle}</span>
              )}
            </h3>

            <p>
              {item.desc}
            </p>

          </div>

        ))}
        </div>
      </div>

    </section>
  );
}

export default Features;