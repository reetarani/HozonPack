import "./LogoSlider.css";
import { logos } from "../../data/logo";

function LogoSlider() {
    return (
        <div className="logo-slider" id="clients">
            <div className="logo-track">
                {logos.map((logo, index) => (
                    <div className="logo-item" key={index}>
                        {logo.name}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LogoSlider;