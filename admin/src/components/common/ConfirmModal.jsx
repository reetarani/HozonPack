import Button from "./Button";
import "./common.css";

function ConfirmModal({
    isOpen,
    title = "Confirm Action",
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    variant = "danger",
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop-custom">
            <div className="confirm-modal">

                <div className="confirm-modal-header">
                    <h5>{title}</h5>

                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onCancel}
                    >
                        ×
                    </button>
                </div>

                <div className="confirm-modal-body">
                    <p>{message}</p>
                </div>

                <div className="confirm-modal-footer">
                    <Button
                        type="button"
                        text={cancelText}
                        variant="secondary"
                        onClick={onCancel}
                    />

                    <Button
                        type="button"
                        text={confirmText}
                        variant={variant}
                        onClick={onConfirm}
                    />
                </div>

            </div>
        </div>
    );
}

export default ConfirmModal;