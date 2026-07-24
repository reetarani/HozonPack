import "./LogoSlider.css";
function LogoSlider() {
const logos = [
  { name: "Premium Labels" },
  { name: "Bologna" },
  { name: "Envi Pack India Pvt Ltd" },
  { name: "PharmEasy" },
  { name: "Universal Boxes" },
  { name: "Benir E Store Solution Pvt Ltd" },
  { name: "Kagada Digital Printing" },
  { name: "Cresurge Pvt Ltd (Kadence)" },
  { name: "Classone Business Pvt Ltd" },
  { name: "Brilliantoffice Solutions Pvt Ltd" },
  { name: "Ecosta System" },
  { name: "MAB Lifestyle India Pvt Ltd" },
  { name: "Napoli Italian Bistro" },
  { name: "Runu International" },
  { name: "SMP Dimension" },
  { name: "Sri Krishna Drip Irrigation" },
  { name: "Sri Someshwara Silk Sarees" },
  { name: "Universal Sales Corporation" },
  { name: "Bongo Bhog" },
  { name: "Sm Agro Fresh" },
  { name: "Apple Fresh" },
  { name: "Sai Sumuka Irrigation Pvt Ltd" },
];
return (
    <div className="logo-slider" id="clients">
      <div className="logo-track">
        {[...logos, ...logos].map((logo, index) => (
          <div className="logo-item" key={index}>
            {logo.name}
          </div>
        ))}
      </div>
    </div>
  );
}
export default LogoSlider;