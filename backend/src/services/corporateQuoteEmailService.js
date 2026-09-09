import transporter from "../config/email.js";

export const sendCorporateQuoteEmail = async (quote) => {
    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.SMTP_TO || process.env.SMTP_USER,

        subject: `New Corporate Quote Request - ${quote.companyName}`,

        text: `
You have received a new corporate quote request.

Company Name:
${quote.companyName}

Contact Name:
${quote.name}

Phone:
${quote.phone}

Email:
${quote.email || "Not provided"}

Quantity:
${quote.quantity}

Box Dimensions:
${quote.dimensions || "Not provided"}

Ply:
${quote.ply}

Special Requirements:
${quote.requirements || "Not provided"}
        `,

        html: `
            <h2>New Corporate Quote Request</h2>

            <p><strong>Company Name:</strong><br>
            ${quote.companyName}</p>

            <p><strong>Contact Name:</strong><br>
            ${quote.name}</p>

            <p><strong>Phone:</strong><br>
            ${quote.phone}</p>

            <p><strong>Email:</strong><br>
            ${quote.email || "Not provided"}</p>

            <p><strong>Quantity:</strong><br>
            ${quote.quantity}</p>

            <p><strong>Box Dimensions:</strong><br>
            ${quote.dimensions || "Not provided"}</p>

            <p><strong>Ply:</strong><br>
            ${quote.ply}</p>

            <p><strong>Special Requirements:</strong><br>
            ${quote.requirements || "Not provided"}</p>
        `,
    };

    return transporter.sendMail(mailOptions);
};