import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }: { children?: React.ReactNode }) {
    const { session, loading } = useAuth(); // হুক থেকে ডাটা নিয়ে আসলাম

    // 🔥 ১. যতক্ষণ সেশন চেক হচ্ছে, ততক্ষণ লোডিং দেখাবে
    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px", fontSize: "1.2rem", color: "#555" }}>
                Checking Authentication... ⏳
            </div>
        );
    }

    // 🔥 ২. চেকিং শেষ হওয়ার পর যদি সেশন না থাকে, তাহলে লগইন পেজে পাঠাবে
    if (!session) {
        return <Navigate to="/login" replace />;
    }

    // 🔥 ৩. সেশন থাকলে কাঙ্ক্ষিত পেজ (ড্যাশবোর্ড/ইভেন্টস) দেখাবে
    return children ? <>{children}</> : <Outlet />;
}