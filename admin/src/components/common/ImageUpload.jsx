import FormGroup from "./FormGroup";
import Button from "./Button";
import "./common.css";

function ImageUpload({
    label,
    name,
    onChange,
    onRemove,
    preview,
    required = false,
    error = "",
    accept = "image/*",
}) {
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        onChange({
            target: {
                name,
                value: file,
            },
        });
    };

    const handleRemove = () => {
        onRemove();
    };

    return (
        <FormGroup
            label={label}
            required={required}
            error={error}
        >
            <input
                type="file"
                name={name}
                accept={accept}
                onChange={handleFileChange}
                className={`form-control ${
                    error ? "is-invalid" : ""
                }`}
            />

            {preview && (
                <div className="mt-3">
                    <img
                        src={preview}
                        alt="Preview"
                        className="img-thumbnail"
                        style={{
                            width: "250px",
                            height: "auto",
                            objectFit: "cover",
                        }}
                    />
                </div>
            )}

            {preview && (
                <div className="mt-2">
                    <Button
                        type="button"
                        text="Remove"
                        onClick={handleRemove}
                        variant="danger"
                    />
                </div>
            )}
        </FormGroup>
    );
}

export default ImageUpload;