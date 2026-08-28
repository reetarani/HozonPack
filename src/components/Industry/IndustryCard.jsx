import { useNavigate } from "react-router-dom";
import "./Industry.css";

function IndustryCard({ industry }) {
    const navigate = useNavigate();

    const {
        name,
        subtitle,
        description,
        image,
        slug,
    } = industry;

    const handleClick = () => {
        navigate(`/industries/${slug}`);
    };

    return (
        <div
            className="industry-card"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    handleClick();
                }
            }}
        >
            {image && (
                <img
                    src={`http://localhost:5000${image}`}
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