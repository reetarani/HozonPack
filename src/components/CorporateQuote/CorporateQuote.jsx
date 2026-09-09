import { useState } from "react";
import { HiCheckCircle } from "react-icons/hi2";

import { createCorporateQuote } from "../../services/corporateQuoteService";
import { sendCorporateQuoteEmail } from "../../services/emailService";

import "./corporateQuote.css";

function CorporateQuote() {
    const [formData, setFormData] = useState({
        companyName: "",
        name: "",
        phone: "",
        email: "",
        quantity: "",
        dimensions: "",
        ply: "3-Ply",
        requirements: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccess("");
        setError("");

        // Basic validation
        if (
            !formData.companyName.trim() ||
            !formData.name.trim() ||
            !formData.phone.trim() ||
            !formData.quantity
        ) {
            setError(
                "Please fill in Company Name, Name, Phone and Quantity."
            );
            return;
        }

        if (Number(formData.quantity) < 1) {
            setError("Quantity must be at least 1.");
            return;
        }

        try {
            setLoading(true);

            const quoteData = {
                companyName: formData.companyName.trim(),
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                quantity: Number(formData.quantity),
                dimensions: formData.dimensions.trim(),
                ply: formData.ply,
                requirements: formData.requirements.trim(),
            };

            console.log("CORPORATE QUOTE DATA:", quoteData);

            /*
             * 1. Save Corporate Quote to MongoDB
             */
            const response = await createCorporateQuote(quoteData);

            console.log(
                "CORPORATE QUOTE DB RESPONSE:",
                response
            );

            if (!response.success) {
                setError(
                    response.message ||
                        "Unable to submit your quote request."
                );
                return;
            }

            /*
             * 2. Send Corporate Quote through EmailJS
             */
            const emailResponse =
                await sendCorporateQuoteEmail(quoteData);

            console.log(
                "CORPORATE QUOTE EMAIL RESPONSE:",
                emailResponse
            );

            /*
             * 3. Success
             */
            setSuccess(
                "Your corporate quote request has been submitted successfully."
            );

            /*
             * 4. Reset form
             */
            setFormData({
                companyName: "",
                name: "",
                phone: "",
                email: "",
                quantity: "",
                dimensions: "",
                ply: "3-Ply",
                requirements: "",
            });

        } catch (error) {
            console.error(
                "Corporate quote submission error:",
                error
            );

            console.error(
                "EmailJS/API error:",
                error?.text ||
                    error?.response?.data ||
                    error?.message
            );

            setError(
                error?.text ||
                    error?.response?.data?.message ||
                    "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="corporate-quote-section" id="corporate-quote">
            <div className="container corporate-quote-container">

                {/* Left Content */}
                <div className="corporate-quote-content">

                    <h2>
                        Request a
                        <span>Quotation</span>
                    </h2>

                    <p className="corporate-quote-description">
                        Get precise, volume-based pricing for your specific
                        industrial requirements. Our engineering team provides
                        detailed technical specifications and landed cost
                        analysis for every inquiry.
                    </p>

                    <ul className="corporate-quote-benefits">

                        <li>
                            <HiCheckCircle />
                            <span>
                                Landed cost per unit, freight included
                            </span>
                        </li>

                        <li>
                            <HiCheckCircle />
                            <span>
                                BCT and Bursting Factor data with every quote
                            </span>
                        </li>

                        <li>
                            <HiCheckCircle />
                            <span>
                                Samples dispatched before you commit
                            </span>
                        </li>

                    </ul>

                </div>

                {/* Form */}
                <div className="corporate-quote-form-wrapper">

                    <form onSubmit={handleSubmit}>

                        <div className="corporate-form-grid">

                            {/* Company Name */}
                            <div className="corporate-form-group">
                                <label>
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="e.g. Acme Corp"
                                    required
                                />
                            </div>

                            {/* Name */}
                            <div className="corporate-form-group">
                                <label>
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Name"
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div className="corporate-form-group">
                                <label>
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91"
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="corporate-form-group">
                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="work@company.com"
                                />
                            </div>

                            {/* Quantity */}
                            <div className="corporate-form-group">
                                <label>
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    placeholder="e.g. 5000"
                                    min="1"
                                    required
                                />
                            </div>

                            {/* Dimensions */}
                            <div className="corporate-form-group">
                                <label>
                                    Box Dimensions (L x W x H) cm
                                </label>

                                <input
                                    type="text"
                                    name="dimensions"
                                    value={formData.dimensions}
                                    onChange={handleChange}
                                    placeholder="Enter dimensions"
                                />
                            </div>

                            {/* Ply */}
                            <div className="corporate-form-group corporate-full-width">
                                <label>
                                    Ply
                                </label>

                                <select
                                    name="ply"
                                    value={formData.ply}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="3-Ply">
                                        3-Ply
                                    </option>

                                    <option value="5-Ply">
                                        5-Ply
                                    </option>

                                    <option value="7-Ply">
                                        7-Ply
                                    </option>
                                </select>
                            </div>

                            {/* Requirements */}
                            <div className="corporate-form-group corporate-full-width">
                                <label>
                                    Special Requirements
                                </label>

                                <textarea
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    placeholder="Tell us about your specific needs..."
                                />
                            </div>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="corporate-quote-error">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="corporate-quote-success">
                                {success}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="corporate-quote-submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Submitting..."
                                : "Request Quote"}
                        </button>

                        <p className="corporate-quote-note">
                            Need under 1,000 boxes? We take any quantity on
                            advance payment.
                        </p>

                    </form>

                </div>

            </div>
        </section>
    );
}

export default CorporateQuote;