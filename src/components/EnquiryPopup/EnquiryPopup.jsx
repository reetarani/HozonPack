import { useState } from "react";
import { createPublicEnquiry } from "../../services/enquiryService";
import { sendEnquiry } from "../../services/emailService";
import { scrollToError } from "../../utils/scrollToError";
import { SUCCESS_MESSAGE_DURATION } from "../../utils/constants";
import {
    validateForm,
    validateField,
} from "../../utils/validation";
import "./EnquiryPopup.css";
    const initialFormData = {
    companyName: "",
    companyLocation: "",
    fullName: "",
    contactNumber: "",
    email: "",
    customMOQ: "",
    dimensions: "",
    message: "",
};
function EnquiryPopup({
    isOpen,
    selectedProduct,
    selectedProductMOQ,
    onClose,
    showProduct = true,
}) {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState("");
    const [submitError, setSubmitError] = useState("");
    const SUCCESS_MESSAGE_DURATION = 3000;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));

        if (errors[name]) {

            const updatedErrors = {
                ...errors,
            };

            delete updatedErrors[name];

            setErrors(updatedErrors);
        }
    };
    const handleReset = () => {
        setFormData(initialFormData);
        setErrors({});
    };
    const handleBlur = (e) => {
            const { name, value } = e.target;

            const error = validateField(name, value);

            setErrors((prevErrors) => {
                const updatedErrors = { ...prevErrors };

                if (error) {
                    updatedErrors[name] = error;
                } else {
                    delete updatedErrors[name];
                }

                return updatedErrors;
            });
        };
        
    const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = validateForm(formData);

        if (showProduct && selectedProductMOQ) {
            const minimumMOQ = Number(selectedProductMOQ);
            const enteredMOQ = Number(formData.customMOQ);

            if (!formData.customMOQ) {
                newErrors.customMOQ =
                    "Please enter required quantity.";
            } else if (enteredMOQ < minimumMOQ) {
                newErrors.customMOQ =
                    `Minimum order quantity is ${minimumMOQ.toLocaleString()} units.`;
            }
        }

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        scrollToError(newErrors);
        return;
    }

    setErrors({});

    try {
        setIsSubmitting(true);

      const enquiryData = {
    companyName: formData.companyName,
    companyLocation: formData.companyLocation,
    name: formData.fullName,
    email: formData.email,
    phone: formData.contactNumber,

    subject: showProduct
        ? selectedProduct
        : "Get a Quote Enquiry",

    customMOQ:
        showProduct && formData.customMOQ
            ? Number(formData.customMOQ)
            : null,
    dimensions: formData.dimensions || "",
    message: formData.message,
};

console.log("ENQUIRY DATA:", enquiryData);

// Save enquiry to MongoDB
await createPublicEnquiry(enquiryData);

// Send enquiry email through EmailJS
const emailSubject = showProduct
    ? `New Product Enquiry - ${selectedProduct}`
    : "New Get a Quote Enquiry";

await sendEnquiry(
    formData,
    selectedProduct || "",
    emailSubject
);

setSubmitError("");
setSubmitSuccess(
    "Enquiry sent successfully!"
);

        handleReset();

        setTimeout(() => {
            setSubmitSuccess("");
            onClose();
        }, SUCCESS_MESSAGE_DURATION);

    } catch (error) {
        console.error(
            "Create enquiry error:",
            error
        );

        setSubmitSuccess("");

        setSubmitError(
            error.response?.data?.message ||
            "Failed to send enquiry. Please try again."
        );

    } finally {
        setIsSubmitting(false);
    }
};
    if (!isOpen) return null;
    return (
        <div className="popup-overlay" onClick={onClose}>
            <div
                className="popup"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="popup-close"
                    onClick={onClose}
                >
                    ×
                </button>

                <h2>Submit an <span>Enquiry</span></h2>

                <p className="popup-subtitle">
                    For any enquiries, kindly fill in the form below...<br/>
                    We will get back to you as soon as possible.
                </p>

                <form className="enquiry-form" onSubmit={handleSubmit}>
                    <div className="form-grid">

                        {/* Company Name */}
                        <div className="form-group">
                            <label>Company Name *</label>
                            <input
                                className={errors.companyName ? "input-error" : ""}
                                type="text"
                                placeholder="Enter company name"
                                name="companyName"
                                value={formData.companyName}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {errors.companyName && (
                                <p className="error">
                                    {errors.companyName}
                                </p>
                            )}
                        </div>

                        {/* Company Location */}
                        <div className="form-group">
                            <label>Company Location *</label>
                            <input
                                className={errors.companyLocation ? "input-error" : ""}
                                type="text"
                                placeholder="Enter company location"
                                name="companyLocation"
                                value={formData.companyLocation}
                                onBlur={handleBlur}
                                onChange={handleChange}
                            />
                            {errors.companyLocation && (
                                <p className="error">
                                    {errors.companyLocation}
                                </p>
                            )}
                        </div>

                        {/* Full Name */}
                        <div className="form-group">
                            <label>Full Name *</label>
                            <input
                                className={errors.fullName ? "input-error" : ""}
                                type="text"
                                placeholder="Enter full name"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.fullName && (
                                <p className="error">
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        {/* Contact Number */}
                        <div className="form-group">
                            <label>Contact Number *</label>
                            <input
                                className={errors.contactNumber ? "input-error" : ""}
                                type="tel"
                                placeholder="Enter contact number"
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.contactNumber && (
                                <p className="error">
                                    {errors.contactNumber}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="form-group full-width">
                            <label>Email <span>(optional)</span></label>
                            <input
                                className={errors.email ? "input-error" : ""}
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.email && (
                                <p className="error">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                            
                        {/* Selected Product */}
                            {showProduct && (
                                <div className="form-group full-width">

                                    <label>Selected Product</label>

                                    <input
                                        type="text"
                                        value={selectedProduct || ""}
                                        readOnly
                                    />

                                    {/* Dynamic MOQ */}
                                    {selectedProductMOQ && (
                                        <p className="moq-note">
                                            MOQ:{" "}
                                            {Number(selectedProductMOQ).toLocaleString()} units
                                        </p>
                                    )}
                                <div className="form-group">
                                    <label>Size / Dimensions</label>

                                    <input
                                        type="text"
                                        name="dimensions"
                                        value={formData.dimensions || ""}
                                        onChange={handleChange}
                                        placeholder="e.g. 12 x 10 x 8 inches"
                                    />
                                </div>
                                    {/* Custom MOQ */}
                                    <label className="custom-moq-label">
                                        Required Quantity *
                                    </label>

                                    <input
                                        type="number"
                                        name="customMOQ"
                                        min={selectedProductMOQ || 1}
                                        value={formData.customMOQ}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder={
                                            selectedProductMOQ
                                                ? `Minimum ${Number(selectedProductMOQ).toLocaleString()} units`
                                                : "Enter required quantity"
                                        }
                                        className={
                                            errors.customMOQ
                                                ? "input-error"
                                                : ""
                                        }
                                    />

                                    {errors.customMOQ && (
                                        <p className="error">
                                            {errors.customMOQ}
                                        </p>
                                    )}

                                </div>
                            )}
                        {/* Message */}
                        <div className="form-group full-width">
                            <label>Your Product Description</label>
                            <textarea
                                rows="5"
                                placeholder="Tell us about your requirement..."
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <div className="form-actions">
                        <button
                            className="submit-btn"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Submit"}
                        </button>

                        <button
                            type="button"
                            className="reset-btn"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                    </div>

                    {submitError && (
                        <p className="error-message">
                            {submitError}
                        </p>
                    )}

                    {submitSuccess && (
                        <p className="success-message">
                            {submitSuccess}
                        </p>
                    )}

                </form>
            </div>
        </div>
    );
}

export default EnquiryPopup;