import "./Industry.css";
import { imageUrl } from "../../services/apiClient";

function IndustryCard({ industry }) {
    const {
        name,
        subtitle,
        description,
        image,
    } = industry;

    return (
        <div className="industry-card">

            {image && (
                <img
                    src={imageUrl(image)}
                    alt={name}
                    className="industry-image"
                />
            )}

            <div className="industry-summary">

                <h3 className="industry-title">
                    {name}
                </h3>

                {subtitle && (
                    <p className="industry-subtitle">
                        {subtitle}
                    </p>
                )}

                {description && (
                    <p className="industry-description">
                        {description}
                    </p>
                )}

            </div>

        </div>
    );
}

export default IndustryCard;