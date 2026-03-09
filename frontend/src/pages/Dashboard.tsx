import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
    const navigate = useNavigate();
    const { session } = useAuth();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            navigate("/login");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Welcome to CRC Dashboard</h1>
                    <p style={styles.subtitle}>Logged in as: <strong style={{ color: "#007bff" }}>{session?.user?.email}</strong></p>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
            </div>

            <div style={styles.grid}>
                {/* Events */}
                <div style={styles.card}>
                    <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📅</div>
                    <h3 style={styles.cardTitle}>Events Management</h3>
                    <p style={styles.cardDesc}>View upcoming events, create new ones, and join as a volunteer.</p>
                    <button onClick={() => navigate("/events")} style={styles.primaryBtn}>Go to Events</button>
                </div>

                {/* Campaigns */}
                <div style={styles.card}>
                    <div style={{ fontSize: "3rem", marginBottom: "15px" }}>💰</div>
                    <h3 style={styles.cardTitle}>Donation Campaigns</h3>
                    <p style={styles.cardDesc}>Explore active campaigns, track fundraising progress, and donate.</p>
                    <button onClick={() => navigate("/campaigns")} style={{ ...styles.primaryBtn, backgroundColor: "#28a745" }}>Go to Campaigns</button>
                </div>

                {/* 🔥 Posts / Blog */}
                <div style={styles.card}>
                    <div style={{ fontSize: "3rem", marginBottom: "15px" }}>✍️</div>
                    <h3 style={styles.cardTitle}>Blog & Updates</h3>
                    <p style={styles.cardDesc}>Write and manage news, articles, and updates about CRC activities.</p>
                    <button onClick={() => navigate("/posts")} style={{ ...styles.primaryBtn, backgroundColor: "#17a2b8" }}>Manage Posts</button>
                </div>

                {/* 🔥 Gallery */}
                <div style={styles.card}>
                    <div style={{ fontSize: "3rem", marginBottom: "15px" }}>🖼️</div>
                    <h3 style={styles.cardTitle}>Image Gallery</h3>
                    <p style={styles.cardDesc}>Upload and showcase photos of our volunteers and field activities.</p>
                    <button onClick={() => navigate("/gallery")} style={{ ...styles.primaryBtn, backgroundColor: "#6f42c1" }}>Manage Gallery</button>
                </div>
            </div>
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: { padding: "40px 20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eee", paddingBottom: "20px", marginBottom: "40px", flexWrap: "wrap", gap: "20px" },
    title: { margin: "0 0 5px 0", color: "#222", fontSize: "1.8rem" },
    subtitle: { margin: "0", color: "#555" },
    logoutBtn: { backgroundColor: "#dc3545", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", transition: "0.2s" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "25px" },
    card: { backgroundColor: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #eaeaea", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "space-between" },
    cardTitle: { margin: "0 0 10px 0", color: "#333", fontSize: "1.2rem" },
    cardDesc: { color: "#666", marginBottom: "20px", fontSize: "0.9rem", flexGrow: 1 },
    primaryBtn: { color: "white", border: "none", padding: "12px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", width: "100%", transition: "0.2s", backgroundColor: "#007bff" }
};