import "./common.css";
import FormGroup from "./FormGroup";
function InputField({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder = "",
    required = false,
    error = "",
}) {
    return (
    <FormGroup
        label={label}
        required={required}
        error={error}
    >
        <input type={type}
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

export default InputField;