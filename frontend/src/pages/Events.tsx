import { useEffect, useState } from "react";
import { api } from "../services/api";

// TypeScript Interface: ইভেন্টের ডাটা স্ট্রাকচার ঠিক রাখার জন্য
interface Event {
    id: string;
    title: string;
    description: string;
    location: string;
    event_date: string;
    participants: any[];
}

export default function Events() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Create Event Form-এর স্টেটগুলো
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [eventDate, setEventDate] = useState("");

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await api.get("/events");
            setEvents(res.data);
        } catch (err: any) {
            setError("Failed to load events. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // নতুন ইভেন্ট তৈরি করার ফাংশন
    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/events", {
                title,
                description,
                location,
                event_date: eventDate,
            });
            alert("Event created successfully! 🎉");
            // ফর্ম ক্লিয়ার করা
            setTitle("");
            setDescription("");
            setLocation("");
            setEventDate("");
            fetchEvents(); // নতুন ইভেন্ট ফেচ করে লিস্ট আপডেট করা
        } catch (err: any) {
            alert("Failed to create event. Make sure you are logged in.");
        }
    };

    // ইভেন্টে জয়েন করার ফাংশন
    const joinEvent = async (id: string) => {
        try {
            await api.post(`/events/${id}/join`);
            alert("Successfully joined the event! ✅");
            fetchEvents(); // জয়েন করার পর পার্টিসিপেন্ট সংখ্যা আপডেট করার জন্য রিফ্রেশ
        } catch (err) {
            alert("Failed to join. Maybe you have already joined?");
        }
    };

    if (loading) return <div style={{ textAlign: "center", marginTop: "50px", fontSize: "1.2rem" }}>Loading events... ⏳</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>CRC Events Dashboard</h1>

            {error && <p style={{ color: "red", textAlign: "center", backgroundColor: "#ffe6e6", padding: "10px", borderRadius: "5px" }}>{error}</p>}

            {/* 🔥 Create Event Form */}
            <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "40px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", border: "1px solid #e9ecef" }}>
                <h3 style={{ marginTop: "0", color: "#495057" }}>➕ Create New Event</h3>
                <form onSubmit={handleCreateEvent} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <input type="text" placeholder="Event Title (e.g., Winter Clothes Distribution)" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
                    <textarea placeholder="Event Description..." value={description} onChange={(e) => setDescription(e.target.value)} required style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
                    <input type="text" placeholder="Location (e.g., TSC, DU)" value={location} onChange={(e) => setLocation(e.target.value)} required style={inputStyle} />
                    <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required style={inputStyle} />
                    <button type="submit" style={{ padding: "12px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem", transition: "0.2s" }}>
                        Publish Event
                    </button>
                </form>
            </div>

            {/* 🔥 Events List */}
            <div>
                <h3 style={{ color: "#333", borderBottom: "2px solid #007bff", paddingBottom: "10px", display: "inline-block" }}>Upcoming Events</h3>
                {events.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#777", marginTop: "20px" }}>No events found. Be the first to create one!</p>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "15px" }}>
                        {events.map((event) => (
                            <div key={event.id} style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", backgroundColor: "white" }}>
                                <h4 style={{ margin: "0 0 10px 0", color: "#007bff", fontSize: "1.4rem" }}>{event.title}</h4>
                                <p style={{ margin: "5px 0", color: "#555", fontSize: "0.95rem" }}><strong>📅 Date & Time:</strong> {new Date(event.event_date).toLocaleString()}</p>
                                <p style={{ margin: "5px 0", color: "#555", fontSize: "0.95rem" }}><strong>📍 Location:</strong> {event.location}</p>
                                <p style={{ margin: "12px 0", color: "#444", lineHeight: "1.5" }}>{event.description}</p>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", borderTop: "1px solid #eee", paddingTop: "15px" }}>
                                    <span style={{ fontSize: "0.9rem", color: "#155724", backgroundColor: "#d4edda", padding: "6px 12px", borderRadius: "20px", fontWeight: "500" }}>
                                        👥 {event.participants?.length || 0} Volunteers Joined
                                    </span>
                                    <button
                                        onClick={() => joinEvent(event.id)}
                                        style={{ backgroundColor: "#007bff", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", transition: "0.2s" }}
                                    >
                                        ✋ Join Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ইনপুট ফিল্ডগুলোর জন্য কমন স্টাইল অবজেক্ট
const inputStyle = {
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #ced4da",
    fontSize: "1rem",
    outline: "none"
};