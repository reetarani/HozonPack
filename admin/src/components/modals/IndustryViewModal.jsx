function IndustryViewModal({
    isOpen,
    onClose,
    industry,
    apiUrl,
}) {
    if (!isOpen || !industry) {
        return null;
    }

    const imageUrl = industry.image
        ? `${apiUrl}${industry.image}`
        : "";

    return (
        <div className="modal-backdrop-custom">
            <div className="product-view-modal">

                {/* Header */}
                <div className="custom-modal-header">
                    <h4>Industry Details</h4>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="product-view-content">

                    {/* LEFT - IMAGE */}
                    <div className="product-view-image">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={industry.name}
                            />
                        ) : (
                            <div className="no-image">
                                No Image
                            </div>
                        )}
                    </div>

                    {/* RIGHT - DETAILS */}
                    <div className="product-view-details">

                        <div className="view-field">
                            <h3>Industry Name</h3>
                            <p>{industry.name || "-"}</p>
                        </div>
                        <div className="view-field">
                            <h3>Industry Subtitle</h3>
                            <p>{industry.subtitle || "-"}</p>
                        </div>

                        <div className="view-field">
                            <h3>Slug</h3>
                            <p>{industry.slug || "-"}</p>
                        </div>

                        <div className="view-field">
                            <h3>Description</h3>
                            <p>
                                {industry.description || "-"}
                            </p>
                        </div>

                        <div className="view-field">
                            <h3 className="status-sec">Status</h3>

                            {industry.isActive ? (
                                <span className="badge bg-success">
                                    Active
                                </span>
                            ) : (
                                <span className="badge bg-danger">
                                    Inactive
                                </span>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default IndustryViewModal;