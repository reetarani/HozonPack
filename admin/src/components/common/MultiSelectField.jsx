import "./common.css";
import FormGroup from "./FormGroup";
function MultiSelectField({
    options = [],
    placeholder = "Select Option",
    label,
    name,
    value = [],
    optionLabel,
    optionValue,
    onChange,
    required = false,
    error = "",
}) 
{
    const handleMultiChange = (e) => {
    const values = Array.from(
        e.target.selectedOptions,
        (option) => option.value
    );

    onChange({
        target: {
            name,
            value: values,
        },
    });
};
    return (
        <FormGroup
            label={label}
            required={required}
            error={error}
        >
                <select multiple
                    name={name}
                    value={value}
                    onChange={handleMultiChange}
                    className={`form-select ${
                        error ? "is-invalid" : ""
                    }`}
                >
                    <option value="" disabled>
                         {placeholder}
                    </option>
                   {options.map((option) => (
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
export default MultiSelectField;
                    