export const EMAILJS_SERVICE_ID =
    import.meta.env.VITE_EMAILJS_SERVICE_ID;

export const EMAILJS_TEMPLATE_ID =
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

export const EMAILJS_PUBLIC_KEY =
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY;


// API configuration
export const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const SERVER_URL =
    API_URL.replace(/\/api$/, "");