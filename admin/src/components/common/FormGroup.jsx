import "./common.css";

function FormGroup({
    label,
    required = false,
    error = "",
    children,
}) {
    return (
        <div className="form-group mb-3">

            <label className="form-label">
                {label}

                {required && (
                    <span className="text-danger ms-1">
                        *
                    </span>
                )}
            </label>

            {children}

            {error && (
                <div className="invalid-feedback d-block">
                    {error}
                </div>
            )}

        </div>
    );
}

export default FormGroup;