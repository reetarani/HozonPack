import { useEffect } from "react";
import "./common.css";

function Toast({
    message,
    type = "success",
    onClose,
    duration = 3000,
}) {
    useEffect(() => {
        if (!message) {
            return;
        }

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [message, duration, onClose]);

    if (!message) {
        return null;
    }

    return (
        <div className={`toast-custom toast-${type}`}>
            <div className="toast-message">
                {message}
            </div>

            <button
                type="button"
                className="toast-close"
                onClick={onClose}
            >
                ×
            </button>
        </div>
    );
}

export default Toast;