import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAuth } from "../context/AuthContext";


const SignUp = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState("");
    const navigate = useNavigate();

    const { signUpNewUser } = userAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!form.email || !form.password || !form.confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        // Call to supabase
        try {
            const result = await signUpNewUser(form.email, form.password);

            if (result.success) {
                setSuccess(true);
                navigate("/success");
            }
        } catch (error) {
            setError("an error occurred");
            console.log(error.message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
            <h2>Sign Up</h2>
            {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
            {success ? (
                <div style={{ color: "green" }}>Sign up successful!</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 12 }}>
                        <label>
                            Email
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                style={{ width: "100%", padding: 8, marginTop: 4 }}
                                autoComplete="email"
                            />
                        </label>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <label>
                            Password
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                style={{ width: "100%", padding: 8, marginTop: 4 }}
                                autoComplete="new-password"
                            />
                        </label>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <label>
                            Confirm Password
                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                style={{ width: "100%", padding: 8, marginTop: 4 }}
                                autoComplete="new-password"
                            />
                        </label>
                    </div>
                    <button type="submit" onClick={handleSubmit} style={{ width: "100%", padding: 10 }}>
                        Sign Up
                    </button>
                </form>
            )}
        </div>
    );
};

export default SignUp;