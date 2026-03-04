import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
    const navigate = useNavigate();
    const { session } = useAuth(); // ইউজারের ইমেইল দেখানোর জন্য

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            navigate("/login");
        }
    };

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>Welcome to CRC Dashboard</h1>
                    <p style={styles.subtitle}>Logged in as: <strong style={{ color: "#007bff" }}>{session?.user.email}</strong></p>
                </div>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                    🚪 Logout
                </button>
            </div>

            {/* Dashboard Cards Grid */}
            <div style={styles.grid}>
                {/* Event Card */}
                <div style={styles.card}>
                    <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📅</div>
                    <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>Events Management</h3>
                    <p style={{ color: "#666", marginBottom: "20px", fontSize: "0.95rem" }}>
                        View upcoming events, create new ones, and join as a volunteer.
                    </p>
                    <button onClick={() => navigate("/events")} style={styles.primaryBtn}>
                        Go to Events
                    </button>
                </div>

                {/* Placeholder for future feature (e.g., Profile or Donations) */}
                <div style={styles.card}>
                    <div style={{ fontSize: "3rem", marginBottom: "15px" }}>👤</div>
                    <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>Volunteer Profile</h3>
                    <p style={{ color: "#666", marginBottom: "20px", fontSize: "0.95rem" }}>
                        Manage your personal details and view your contribution history.
                    </p>
                    <button style={styles.disabledBtn} disabled>
                        Coming Soon...
                    </button>
                </div>
            </div>
        </div>
    );
}

// 🔥 Dashboard UI Styles
const styles: { [key: string]: React.CSSProperties } = {
    container: { padding: "40px 20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eee", paddingBottom: "20px", marginBottom: "40px", flexWrap: "wrap", gap: "20px" },
    title: { margin: "0 0 5px 0", color: "#222" },
    subtitle: { margin: "0", color: "#555" },
    logoutBtn: { backgroundColor: "#dc3545", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", transition: "0.2s" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px" },
    card: { backgroundColor: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)", border: "1px solid #eaeaea", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "space-between" },
    primaryBtn: { backgroundColor: "#007bff", color: "white", border: "none", padding: "12px", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", width: "100%" },
    disabledBtn: { backgroundColor: "#e9ecef", color: "#6c757d", border: "none", padding: "12px", borderRadius: "5px", cursor: "not-allowed", fontWeight: "bold", width: "100%" }
};