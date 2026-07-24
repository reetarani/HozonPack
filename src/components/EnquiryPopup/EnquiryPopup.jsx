import { useState } from "react";
import emailjs from "@emailjs/browser";
import "./EnquiryPopup.css";
    const initialFormData = {
    companyName: "",
    companyLocation: "",
    fullName: "",
    contactNumber: "",
    email: "",
    message: "",
};
        
function EnquiryPopup({
    isOpen,
    selectedProduct,
    onClose,
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
    const validateForm = () => {
    const newErrors = {};

        if (!formData.companyName.trim()) {
            newErrors.companyName = "Company Name is required";
        }

        if (!formData.companyLocation.trim()) {
            newErrors.companyLocation = "Company Location is required";
        }

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full Name is required";
        }

        if (!formData.contactNumber.trim()) {
            newErrors.contactNumber = "Contact Number is required";
        } 
        else if (!/^\d{10}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = "Please enter a valid 10-digit contact number";
        }

        if (
            formData.email &&
            !/\S+@\S+\.\S+/.test(formData.email)
        ) {
            newErrors.email = "Please enter a valid email";
        }

        return newErrors;
    };
    const validateField = (name, value) => {
            let error = "";

            switch (name) {
                case "companyName":
                    if (!value.trim()) {
                        error = "Company Name is required";
                    }
                    break;

                case "email":
                    if (!value.trim()) {
                        error = "Email is required";
                    } else if (value && !/\S+@\S+\.\S+/.test(value)) {
                        error = "Please enter a valid email";
                    }
                    break;

                case "contactNumber":
                    if (!value.trim()) {
                        error = "Contact Number is required";
                    } else if (!/^[0-9]{10}$/.test(value)) {
                        error = "Please enter a valid 10-digit number";
                    }
                    break;
                case "companyLocation":
                if (!value.trim()) {
                    error = "Company Location is required";
                }
                break;

            case "fullName":
                if (!value.trim()) {
                    error = "Full Name is required";
                }
                break;

            case "message":
                if (!value.trim()) {
                    error = "Message is required";
                }
                break;
                
                default:
                    break;
            }

            return error;
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
    const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);

                const firstErrorField = Object.keys(newErrors)[0];

                const element = document.querySelector(
                    `[name="${firstErrorField}"]`
                );

                if (element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                    });

                    element.focus();
                }

                return;
            }
            setErrors({});
            // API Call
            const templateParams = {
            company_name: formData.companyName,
            company_location: formData.companyLocation,
            full_name: formData.fullName,
            contact_number: formData.contactNumber,
            email: formData.email,
            selected_product: selectedProduct,
            message: formData.message,
            };
            try {
                setIsSubmitting(true);
                await emailjs.send(
                    import.meta.env.VITE_EMAILJS_SERVICE_ID,
                    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                    templateParams,
                    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                );

                setSubmitError("");
                setSubmitSuccess("Enquiry sent successfully!");
                handleReset();
                    setTimeout(() => {
                        setSubmitSuccess("");
                        onClose();
                    }, SUCCESS_MESSAGE_DURATION);

            } catch (error) {
                console.error(error);

                setSubmitSuccess("");
                setSubmitError("Failed to send enquiry. Please try again.");

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
                        <div className="form-group">
                        <label>Company Name *</label>
                        <input className={
                                    errors.companyName
                                        ? "input-error"
                                        : ""
                                }
                            type="text"
                            placeholder="Enter company name" name="companyName"
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

                    <div className="form-group">
                        <label>Company Location *</label>
                        <input className={
                                    errors.companyLocation
                                        ? "input-error"
                                        : ""
                                }
                            type="text"
                            placeholder="Enter company location" name="companyLocation"
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

                    <div className="form-group">
                        <label>Full Name *</label>
                        <input className={
                                    errors.fullName
                                        ? "input-error"
                                        : ""
                                }
                            type="text"
                            placeholder="Enter full name" name="fullName"
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

                    <div className="form-group">
                        <label>Contact Number *</label>
                        <input className={
                                    errors.contactNumber
                                        ? "input-error"
                                        : ""
                                }
                            type="tel"
                            placeholder="Enter contact number" name="contactNumber"
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

                    <div className="form-group">
                        <label>Email</label>
                        <input className={
                                    errors.email
                                        ? "input-error"
                                        : ""
                                }
                            type="email"
                            placeholder="Enter email" name="email"
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

                    <div className="form-group">
                        <label>Selected Product</label>

                        <input
                            type="text"
                            value={selectedProduct}
                            readOnly
                        />
                    </div>
                    </div>
                    

                    <div className="form-group">
                        <label>Message</label>

                        <textarea
                            rows="5"
                            placeholder="Tell us about your requirement..."
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                        />                     
                    </div>
                    <div className="form-actions">
                        <button className="submit-btn"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Submit"}
                        </button>

                        <button
                            type="button"
                            className="reset-btn" onClick={handleReset}
                        >
                            Reset
                        </button>
                    </div>
                        {
                            submitError && (
                                <p className="error-message">
                                    {submitError}
                                </p>
                            )
                        }
                        {
                            submitSuccess && (
                                <p className="success-message">
                                    {submitSuccess}
                                </p>
                            )
                        }
                </form>
            </div>
        </div>
    );
}

export default EnquiryPopup;