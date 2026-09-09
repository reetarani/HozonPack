import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import Button from "../common/Button";

import "./forms.css";

function TopBarForm({
    formData,
    errors,
    onChange,
    onSubmit,
    isSubmitting,
}) {
    return (
        <form onSubmit={onSubmit}>

            <InputField
                label="Offer Text"
                name="title"
                value={formData.title}
                onChange={onChange}
                placeholder="Save 21% on custom packaging"
                required
                error={errors?.title}
            />

            <InputField
                label="Coupon Code"
                name="couponCode"
                value={formData.couponCode}
                onChange={onChange}
                placeholder="SPRINGBOX"
                error={errors?.couponCode}
            />

            <div className="form-group mb-3">

                <label className="form-label">
                    End Date & Time
                    <span className="text-danger">
                        {" "}*
                    </span>
                </label>

                <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={onChange}
                    className={`form-control ${
                        errors?.endDate
                            ? "is-invalid"
                            : ""
                    }`}
                />

                {errors?.endDate && (
                    <div className="text-danger mt-1">
                        {errors.endDate}
                    </div>
                )}

            </div>

            <InputField
                label="Link Text"
                name="linkText"
                value={formData.linkText}
                onChange={onChange}
                placeholder="Shop now"
                error={errors?.linkText}
            />

            <InputField
                label="Link URL"
                name="linkUrl"
                value={formData.linkUrl}
                onChange={onChange}
                placeholder="/"
                error={errors?.linkUrl}
            />

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
                        ? "Update Top Bar"
                        : "Save Top Bar"
                }
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
            />

        </form>
    );
}

export default TopBarForm;