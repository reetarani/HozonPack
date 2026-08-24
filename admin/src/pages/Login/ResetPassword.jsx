import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                `/auth/reset-password/${token}`,
                {
                    password,
                }
            );

            setMessage(
                response.data.message ||
                "Password reset successfully."
            );

            setPassword("");
            setConfirmPassword("");

            // Go to login after a short delay
            setTimeout(() => {
                navigate("/login", {
                    replace: true,
                });
            }, 2000);

        } catch (error) {
            console.error(
                "Reset password error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-box">

                <div className="login-header">
                    <h2>Reset Password</h2>

                    <p>
                        Create a new password for your account
                    </p>
                </div>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="login-success">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="login-field">
                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Enter new password"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Reset Password"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default ResetPassword;