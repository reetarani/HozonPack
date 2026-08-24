import "./common.css";
import FormGroup from "./FormGroup";
function TextAreaField({
    label,
    name,
    value,
    onChange,
    placeholder = "",
    rows = 3,
    required = false,
    error = "",
}) {
    return (
        <FormGroup
            label={label}
            required={required}
            error={error}
        >
            <textarea
                rows={rows}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`form-control ${
                    error ? "is-invalid" : ""
                }`}
            />
        </FormGroup>
    );
}

export default TextAreaField;