import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";
import "./Login.css"

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
    const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

    if (token) {
        navigate("/", { replace: true });
    }
}, [navigate]);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            const response = await api.post(
                "/auth/login",
                formData
            );

            const storage = rememberMe
                ? localStorage
                : sessionStorage;

            storage.setItem("token", response.data.token);
            storage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Invalid username or password."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
    <div className="login-page">

        <div className="login-box">

            <div className="login-header">
                <h2>Hozonpack</h2>
                <p>Admin Panel</p>
            </div>

            {error && (
                <div className="login-error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <div className="login-field">
                    <label>
                        Username or Email
                    </label>

                    <input
                        type="text"
                        className="email-input"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter username or email"
                        autoComplete="username"
                        required
                    />
                </div>

                <div className="login-field">
                    <label>
                        Password
                    </label>

                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            className="password-input"
                            onChange={handleChange}
                            placeholder="Enter password"
                            autoComplete="current-password"
                            required
                        />
                       

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                                setShowPassword((prev) => !prev)
                            }
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword ? (
                                <FaEyeSlash />
                            ) : (
                                <FaEye />
                            )}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="login-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
                <div className="remember-row">
                    <label>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) =>
                                setRememberMe(e.target.checked)
                            }
                        />

                        <span>Remember me</span>
                    </label>

                    <button
                        type="button"
                        className="forgot-password"
                        onClick={() => navigate("/forgot-password")}
                    >
                        Forgot Password?
                    </button>
                </div>
            </form>

        </div>

    </div>
);}

export default Login;