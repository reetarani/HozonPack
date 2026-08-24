import "./common.css";

function Modal({
    isOpen,
    title,
    onClose,
    children,
    size = "modal-lg",
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="custom-modal-overlay">
            <div
                className={`custom-modal ${size}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="custom-modal-header">
                    <h5 className="mb-0">{title}</h5>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="custom-modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;