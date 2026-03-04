import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            alert("Signup successful! Welcome to CRC.");
            navigate("/dashboard");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Join CRC Today 🌱</h2>
                <p style={styles.subtitle}>Become a volunteer and make an impact</p>

                <form onSubmit={handleSignup} style={styles.form}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Create Password (min 6 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <button type="submit" disabled={loading} style={{ ...styles.button, backgroundColor: "#28a745", opacity: loading ? 0.7 : 1 }}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Already have an account?{" "}
                    <span onClick={() => navigate("/login")} style={styles.link}>
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}

// 🔥 UI Styles (Same as Login but with green button)
const styles: { [key: string]: React.CSSProperties } = {
    container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f4f7f6", fontFamily: "sans-serif" },
    card: { backgroundColor: "white", padding: "40px", borderRadius: "10px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "100%", maxWidth: "400px", textAlign: "center" },
    title: { margin: "0 0 10px 0", color: "#333", fontSize: "1.8rem" },
    subtitle: { margin: "0 0 30px 0", color: "#777", fontSize: "1rem" },
    form: { display: "flex", flexDirection: "column", gap: "15px" },
    input: { padding: "12px", borderRadius: "5px", border: "1px solid #ddd", fontSize: "1rem", outline: "none" },
    button: { padding: "12px", color: "white", border: "none", borderRadius: "5px", fontSize: "1.1rem", cursor: "pointer", fontWeight: "bold", transition: "0.3s" },
    footerText: { marginTop: "20px", color: "#555", fontSize: "0.95rem" },
    link: { color: "#007bff", cursor: "pointer", fontWeight: "bold", textDecoration: "underline" }
};