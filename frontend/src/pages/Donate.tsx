import { useState } from "react";
import { api } from "../services/api";

export default function Donate({ campaignId, onSuccess }: { campaignId: string, onSuccess: () => void }) {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("");
    const [transaction, setTransaction] = useState("");
    const [loading, setLoading] = useState(false);

    const donate = async () => {
        if (!amount || !method || !transaction) {
            alert("Please fill all the fields!");
            return;
        }

        setLoading(true);
        try {
            await api.post("/donations", {
                amount: Number(amount),
                method,
                transaction_id: transaction,
                campaign_id: campaignId
            });

            alert("Donation submitted successfully! 💖");
            setAmount("");
            setMethod("");
            setTransaction("");
            onSuccess(); // 🔥 Donation success hole data refresh korbe
        } catch (error) {
            alert("Failed to submit donation.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ marginTop: "15px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "8px", border: "1px solid #ddd" }}>
            <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>Make a Donation</h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                    type="number"
                    placeholder="Amount (BDT)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Payment Method (e.g., Bkash/Nagad)"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Transaction ID"
                    value={transaction}
                    onChange={(e) => setTransaction(e.target.value)}
                    style={inputStyle}
                />
                <button
                    onClick={donate}
                    disabled={loading}
                    style={{ padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? "Processing..." : "Submit Donation"}
                </button>
            </div>
        </div>
    );
}

const inputStyle = { padding: "10px", borderRadius: "5px", border: "1px solid #ced4da", outline: "none" };