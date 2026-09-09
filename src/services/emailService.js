import emailjs from "@emailjs/browser";

import {
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY,
} from "../config/env";

export const sendEnquiry = (
    formData,
    selectedProduct = "",
    enquirySubject = ""
) => {
    const templateParams = {
        company_name: formData.companyName,
        company_location: formData.companyLocation,
        full_name: formData.fullName,
        contact_number: formData.contactNumber,
        email: formData.email,
        selected_product: selectedProduct || "",
        custom_moq: formData.customMOQ || "",
        dimensions: formData.dimensions || "",
        ply: formData.ply || "",
        message: formData.message || "",
        subject: enquirySubject,
    };

    return emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
    );
};

export const sendCorporateQuoteEmail = async (quoteData) => {
    const templateParams = {
        company_name: quoteData.companyName || "",
        company_location: "",
        full_name: quoteData.name || "",
        contact_number: quoteData.phone || "",
        email: quoteData.email || "",
        selected_product: "Corporate Quote",
        custom_moq: quoteData.quantity || "",
        dimensions: quoteData.dimensions || "",
        ply: quoteData.ply || "",
        message: quoteData.requirements || "",
        subject: "New Corporate Quote Request",
    };

    console.log(
        "Corporate Quote EmailJS params:",
        templateParams
    );

    try {
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );

        console.log("EmailJS SUCCESS:", response);

        return response;
    } catch (error) {
        console.error("EmailJS FAILED:", error);
        console.error("EmailJS status:", error?.status);
        console.error("EmailJS text:", error?.text);

        throw error;
    }
};