import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import Donate from "./Donate";

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDonateId, setActiveDonateId] = useState<string | null>(null); // 🔥 Kon campaign-er donate form khola thakbe
    const navigate = useNavigate();

    // Create Campaign States
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [goalAmount, setGoalAmount] = useState("");

    const fetchCampaigns = async () => {
        try {
            const res = await api.get("/campaigns");
            setCampaigns(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    // Campaign Add korar function
    const handleCreateCampaign = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/campaigns", {
                title,
                description,
                goal_amount: Number(goalAmount),
                status: "ACTIVE"
            });
            alert("Campaign added successfully! 🎉");
            setTitle("");
            setDescription("");
            setGoalAmount("");
            fetchCampaigns(); // List refresh
        } catch (err) {
            alert("Failed to create campaign.");
        }
    };

    if (loading) return <div style={{ textAlign: "center", marginTop: "50px", fontSize: "1.2rem" }}>Loading Campaigns... ⏳</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <button
                onClick={() => navigate("/dashboard")}
                style={{ marginBottom: "20px", padding: "8px 15px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
            >
                ⬅️ Back to Dashboard
            </button>

            <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>Charity Campaigns 🌱</h1>

            {/* 🔥 Admin / Create Campaign Form */}
            <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "40px", border: "1px solid #e9ecef" }}>
                <h3 style={{ marginTop: "0", color: "#495057" }}>➕ Add New Campaign</h3>
                <form onSubmit={handleCreateCampaign} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input type="text" placeholder="Campaign Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required style={{ ...inputStyle, minHeight: "60px" }} />
                    <input type="number" placeholder="Goal Amount (BDT)" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} required style={inputStyle} />
                    <button type="submit" style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                        Create Campaign
                    </button>
                </form>
            </div>

            {/* 🔥 Campaigns List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                {campaigns.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#777" }}>No active campaigns.</p>
                ) : (
                    campaigns.map((c) => {
                        const progress = c.goal_amount > 0 ? (c.raised_amount / c.goal_amount) * 100 : 0;

                        return (
                            <div key={c.id} style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                                <h3 style={{ margin: "0 0 10px 0", color: "#007bff", fontSize: "1.4rem" }}>{c.title}</h3>
                                <p style={{ color: "#555", marginBottom: "15px" }}>{c.description}</p>

                                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", color: "#444", marginBottom: "8px" }}>
                                    <span>Raised: {c.raised_amount || 0} BDT</span>
                                    <span>Goal: {c.goal_amount} BDT</span>
                                </div>

                                {/* Progress Bar */}
                                <div style={{ width: "100%", height: "12px", backgroundColor: "#e9ecef", borderRadius: "6px", overflow: "hidden" }}>
                                    <div style={{ width: `${Math.min(progress, 100)}%`, height: "100%", backgroundColor: progress >= 100 ? "#28a745" : "#007bff", transition: "width 0.5s ease-in-out" }}></div>
                                </div>

                                <button
                                    onClick={() => setActiveDonateId(activeDonateId === c.id ? null : c.id)}
                                    style={{ marginTop: "15px", padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                                >
                                    {activeDonateId === c.id ? "Cancel Donation" : "💖 Donate Now"}
                                </button>

                                {/* 🔥 Donate Form Component */}
                                {activeDonateId === c.id && (
                                    <Donate campaignId={c.id} onSuccess={() => {
                                        setActiveDonateId(null);
                                        fetchCampaigns();
                                    }} />
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

const inputStyle = { padding: "10px", borderRadius: "5px", border: "1px solid #ced4da", outline: "none" };