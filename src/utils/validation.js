const emailRegex = /\S+@\S+\.\S+/;

const phoneRegex = /^[0-9]{10}$/;
export const validateForm = (formData) => {
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
        else if (!phoneRegex.test(formData.contactNumber)) {
            newErrors.contactNumber = "Please enter a valid 10-digit contact number";
        }

        if (
            formData.email &&
            !emailRegex.test(formData.email)
        ) {
            newErrors.email = "Please enter a valid email";
        }

        return newErrors;
    };
    export const validateField = (name, value) => {
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
                    } else if (!emailRegex.test(value)) {
                        error = "Please enter a valid email";
                    }
                    break;

                case "contactNumber":
                    if (!value.trim()) {
                        error = "Contact Number is required";
                    } else if (!phoneRegex.test(value)) {
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
    

       