import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import Button from "../common/Button";
import "./forms.css";

function ClientForm({
    formData,
    errors,
    onChange,
    onSubmit,
    isSubmitting,
}) {
    return (
        <form onSubmit={onSubmit}>

            <InputField
                label="Client Name"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Enter Client Name"
                required
                error={errors?.name}
            />

            {/* Logo */}
            <div className="form-group mb-3">

                <label className="form-label">
                    Logo
                </label>

                {/* Existing Logo */}
                {formData.imageUrl && (
                    <div className="mb-3">

                        <label className="form-label">
                            Current Logo
                        </label>

                        <div>
                            <img
                                src={`http://localhost:5000${formData.imageUrl}`}
                                alt="Current client logo"
                                width="100"
                                height="100"
                                style={{
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                    border: "1px solid #ddd",
                                    padding: "5px",
                                }}
                            />
                        </div>

                    </div>
                )}

                <input
                    type="file"
                    name="logo"
                    accept="image/*"
                    className="form-control"
                    onChange={onChange}
                />

                {errors?.logo && (
                    <div className="text-danger mt-1">
                        {errors.logo}
                    </div>
                )}

            </div>

            {/* Status */}
            <SelectField
                label="Status"
                name="isActive"
                value={String(formData.isActive)}
                options={[
                    {
                        label: "Active",
                        value: "true",
                    },
                    {
                        label: "Inactive",
                        value: "false",
                    },
                ]}
                optionLabel="label"
                optionValue="value"
                onChange={onChange}
                placeholder="Select Status"
                required
                error={errors?.isActive}
            />

            <Button
                type="submit"
                text={
                    formData._id
                        ? "Update Client"
                        : "Save Client"
                }
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
            />

        </form>
    );
}

export default ClientForm;