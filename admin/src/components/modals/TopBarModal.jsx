import TopBarForm from "../forms/TopBarForm";

function TopBarModal({
    isOpen,
    onClose,
    formData,
    errors,
    onChange,
    onSubmit,
    isSubmitting,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">

            <div className="modal-content">

                <div className="modal-header">

                    <h3>
                        {formData._id
                            ? "Edit Top Bar"
                            : "Add Top Bar"}
                    </h3>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>

                <div className="modal-body">

                    <TopBarForm
                        formData={formData}
                        errors={errors}
                        onChange={onChange}
                        onSubmit={onSubmit}
                        isSubmitting={isSubmitting}
                    />

                </div>

            </div>

        </div>
    );
}

export default TopBarModal;