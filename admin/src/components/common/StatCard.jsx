function StatCard({
    title,
    value,
    description,
    icon,
    onClick,
}) {
    return (
        <div
            className={`stat-card ${
                onClick ? "stat-card-clickable" : ""
            }`}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <div className="stat-card-top">

                <div>
                    <p className="stat-card-title">
                        {title}
                    </p>

                    <h2 className="stat-card-value">
                        {value}
                    </h2>

                    <p className="stat-card-description">
                        {description}
                    </p>
                </div>

                {icon && (
                    <div className="stat-card-icon">
                        {icon}
                    </div>
                )}

            </div>
        </div>
    );
}

export default StatCard;