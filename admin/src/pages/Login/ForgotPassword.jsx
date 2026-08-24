import { useState } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import api from "../../services/api";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
        const response = await api.post(
            "/auth/forgot-password",
            {
                email: email.trim(),
            }
        );

        const resetLink = response.data.resetLink;

        await emailjs.send(
            "service_mbd34gh",
            "template_4zl6v1n",
            {
                name: response.data.name || "Admin",
                email: email,
                reset_link: resetLink,
            },
            {
                publicKey: "vtHUVZAsVuuMST_Ji",
            }
        );

        setMessage(
            "If the email exists, a password reset link has been sent."
        );

    } catch (error) {
        console.error(
            "FORGOT PASSWORD ERROR:",
            error
        );

        setError(
            error.response?.data?.message ||
            "Unable to process your request."
        );

    } finally {
        setLoading(false);
    }
};
    return (
        <div className="login-page">

            <div className="login-box">

                <div className="login-header">
                    <h2>Forgot Password</h2>

                    <p>
                        Enter your email to reset your password
                    </p>
                </div>

                {message && (
                    <div className="login-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="login-field">

                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reset Link"}
                    </button>

                </form>

                <button
                    type="button"
                    className="forgot-password"
                    onClick={() => navigate("/login")}
                    style={{
                        marginTop: "20px",
                        width: "100%",
                    }}
                >
                    Back to Login
                </button>

            </div>

        </div>
    );
}

export default ForgotPassword;