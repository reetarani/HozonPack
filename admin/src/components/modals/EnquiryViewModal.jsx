function EnquiryViewModal({
    isOpen,
    onClose,
    enquiry,
}) {
    if (!isOpen || !enquiry) {
        return null;
    }

    return (
        <div className="modal-backdrop-custom">

            <div className="product-view-modal">

                <div className="custom-modal-header">
                    <h4>
                        Enquiry Details
                    </h4>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="product-view-details">
                    <div className="view-field">
                        <h3>Company Name</h3>
                        <p>
                            {enquiry.companyName || "-"}
                        </p>
                    </div>
                    <div className="view-field">
                        <h3>Company Location</h3>
                        <p>
                            {enquiry.companyLocation || "-"}
                        </p>
                    </div>

                    <div className="view-field">
                        <h3>Name</h3>
                        <p>
                            {enquiry.name || "-"}
                        </p>
                    </div>

                    <div className="view-field">
                        <h3>Email</h3>
                        <p>
                            {enquiry.email || "-"}
                        </p>
                    </div>

                    <div className="view-field">
                        <h3>Phone</h3>
                        <p>
                            {enquiry.phone || "-"}
                        </p>
                    </div>

                    <div className="view-field">
    <h3>Subject</h3>
    <p>
        {enquiry.subject || "-"}
    </p>
</div>

{enquiry.customMOQ !== null &&
    enquiry.customMOQ !== undefined && (
        <div className="view-field">
            <h3>Required Quantity</h3>
            <p>
                {Number(enquiry.customMOQ).toLocaleString()} units
            </p>
        </div>
    )}

<div className="view-field">
    <h3>Message</h3>
    <p className="enquiry-message">
        {enquiry.message || "-"}
    </p>
</div>

                    <div className="view-field">
                        <h3 className="status-sec">Status</h3>

                        {enquiry.status ===
                        "new" ? (
                            <span className="badge bg-warning text-dark">
                                New
                            </span>
                        ) : (
                            <span className="badge bg-success">
                                Read
                            </span>
                        )}
                    </div>

                    <div className="view-field">
                        <h3>Submitted On</h3>
                        <p>
                            {enquiry.createdAt
                                ? new Date(
                                      enquiry.createdAt
                                  ).toLocaleString()
                                : "-"}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default EnquiryViewModal;