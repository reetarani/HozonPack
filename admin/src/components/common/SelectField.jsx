import "./common.css";
import FormGroup from "./FormGroup";
function SelectField({
    options = [],
    placeholder = "Select Option",
    label,
    name,
    value,
    optionLabel,
    optionValue,
    onChange,
    required = false,
    error = "",
}) {
    return (
        <FormGroup
            label={label}
            required={required}
            error={error}
        >
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`form-select ${
                    error ? "is-invalid" : ""
                }`}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
               {(options || []).map((option) => (
                    <option
                        key={option[optionValue]}
                        value={option[optionValue]}
                    >
                        {option[optionLabel]}
                    </option>
                ))} 
            </select>
        </FormGroup>
    );
}
export default SelectField;