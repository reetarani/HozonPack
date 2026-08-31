import ClientForm from "../forms/ClientForm";

function ClientModal({
    isOpen,
    onClose,
    formData,
    errors,
    onChange,
    onSubmit,
    onRemoveLogo, // ✅ add this
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
                            ? "Edit Client"
                            : "Add Client"}
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
                    <ClientForm
                        formData={formData}
                        errors={errors}
                        onChange={onChange}
                        onSubmit={onSubmit}
                        onRemoveLogo={onRemoveLogo} // ✅ add this
                        isSubmitting={isSubmitting}
                    />
                </div>

            </div>

        </div>
    );
}

export default ClientModal;