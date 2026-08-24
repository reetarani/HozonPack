import HeroForm from "../forms/HeroForm";

function HeroModal({
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
                            ? "Edit Hero"
                            : "Add Hero"}
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

                    <HeroForm
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

export default HeroModal;