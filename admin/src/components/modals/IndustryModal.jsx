import IndustryForm from "../forms/IndustryForm";
import "../common/common.css";


function IndustryModal({
    isOpen,
    onClose,
    formData,
    errors,
    preview,
    onChange,
    onImageChange,
    onRemove,

    onDescriptionListChange,
    onAddDescriptionList,
    onRemoveDescriptionList,

    onSubmit,
    isSubmitting,
    editingId,
}) {

    if (!isOpen) {
        return null;
    }


    return (
        <div className="modal-backdrop-custom">

            <div className="custom-modal">

                {/* Header */}

                <div className="custom-modal-header">

                    <h4>
                        {editingId
                            ? "Edit Industry"
                            : "Add Industry"}
                    </h4>


                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                {/* Body */}

                <div className="custom-modal-body">

                    <IndustryForm

                        formData={formData}

                        errors={errors}

                        preview={preview}

                        onChange={onChange}

                        onImageChange={
                            onImageChange
                        }

                        onRemove={
                            onRemove
                        }


                        onDescriptionListChange={
                            onDescriptionListChange
                        }

                        onAddDescriptionList={
                            onAddDescriptionList
                        }

                        onRemoveDescriptionList={
                            onRemoveDescriptionList
                        }


                        onSubmit={onSubmit}

                        isSubmitting={
                            isSubmitting
                        }

                    />

                </div>

            </div>

        </div>
    );
}


export default IndustryModal;