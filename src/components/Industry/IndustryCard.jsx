import "./Industry.css";

function IndustryCard({ industry }) {
    const {
        title,
        subtitle,
        description,
        image,
        size,
    } = industry;
    return (
        <div className={`industry-card ${size}`}>
            <img
                src={image}
                alt={title}
                className="industry-image"
            />

            <div className="industry-summary">
                <h3 className="industry-title">{title}</h3>

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