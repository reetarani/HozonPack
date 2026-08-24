import "./common.css";
function Button({
    text,
    onClick,
    type = "button",
    variant = "primary",
    icon,
    loading = false,
    disabled = false,
}) {

    return (

        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`btn btn-${variant}`}
        >

            {loading ? (
                <>
                    <span
                        className="spinner-border spinner-border-sm me-2"
                    ></span>

                    Loading...
                </>
            ) : (

                   <>
                    {icon && (
                        <span className="me-2">
                            {icon}
                        </span>
                    )}

                    {text}
                </>
            )}

        </button>

    );

}
export default Button;