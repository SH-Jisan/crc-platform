import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Posts() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Create Post States
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const fetchPosts = async () => {
        try {
            const res = await api.get("/posts");
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/posts", { title, content });
            alert("Post published successfully! 🎉");
            setTitle("");
            setContent("");
            fetchPosts();
        } catch (err) {
            alert("Failed to publish post.");
        }
    };

    if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading Posts... ⏳</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <button onClick={() => navigate("/dashboard")} style={backBtnStyle}>⬅️ Back to Dashboard</button>
            <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>CRC Updates & Blog ✍️</h1>

            {/* Create Post Form */}
            <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "40px", border: "1px solid #e9ecef" }}>
                <h3 style={{ marginTop: "0", color: "#495057" }}>➕ Write a New Post</h3>
                <form onSubmit={handleCreatePost} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input type="text" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />
                    <textarea placeholder="Write your content here..." value={content} onChange={(e) => setContent(e.target.value)} required style={{ ...inputStyle, minHeight: "120px" }} />
                    <button type="submit" style={{ padding: "10px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                        Publish Post
                    </button>
                </form>
            </div>

            {/* Posts List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {posts.length === 0 ? <p style={{ textAlign: "center", color: "#777" }}>No posts yet.</p> :
                    posts.map((post) => (
                        <div key={post.id} style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#fff" }}>
                            <h3 style={{ margin: "0 0 10px 0", color: "#17a2b8", fontSize: "1.4rem" }}>{post.title}</h3>
                            <p style={{ margin: "0 0 15px 0", color: "#555", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{post.content}</p>
                            <div style={{ borderTop: "1px solid #eee", paddingTop: "10px", fontSize: "0.85rem", color: "#888", display: "flex", justifyContent: "space-between" }}>
                                <span>Author: {post.author?.name || "CRC Member"}</span>
                                <span>Status: {post.status}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

const inputStyle = { padding: "10px", borderRadius: "5px", border: "1px solid #ced4da", outline: "none", fontSize: "1rem" };
const backBtnStyle = { marginBottom: "20px", padding: "8px 15px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" };