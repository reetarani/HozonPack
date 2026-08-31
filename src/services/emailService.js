// emailService.js

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
        // MOQ entered by customer
        custom_moq: formData.customMOQ || "",
        message: formData.message,
        subject: enquirySubject,
    };

    return emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
    );
};