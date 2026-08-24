import InputField from "../common/InputField";
import SelectField from "../common/SelectField";
import Button from "../common/Button";

import "./forms.css";

function UserForm({
    formData,
    errors,
    onChange,
    onSubmit,
    isSubmitting,
}) {
    return (
        <form onSubmit={onSubmit}>

            <InputField
                label="Username"
                name="username"
                value={formData.username}
                onChange={onChange}
                placeholder="Enter Username"
                required
                error={errors?.username}
            />

            <InputField
                label="Name"
                name="name"
                value={formData.name}
                onChange={onChange}
                placeholder="Enter Name"
                required
                error={errors?.name}
            />

            <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="Enter Email"
                required
                error={errors?.email}
            />

            <InputField
                label={
                    formData._id
                        ? "Password (leave blank to keep current)"
                        : "Password"
                }
                name="password"
                type="password"
                value={formData.password}
                onChange={onChange}
                placeholder={
                    formData._id
                        ? "Leave blank to keep current password"
                        : "Enter Password"
                }
                required={!formData._id}
                error={errors?.password}
            />

            <SelectField
                label="Role"
                name="role"
                value={formData.role}
                options={[
                    {
                        label: "Admin",
                        value: "admin",
                    },
                ]}
                optionLabel="label"
                optionValue="value"
                onChange={onChange}
                required
                error={errors?.role}
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
                required
                error={errors?.isActive}
            />

            <Button
                type="submit"
                text="Save User"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting}
            />

        </form>
    );
}

export default UserForm;