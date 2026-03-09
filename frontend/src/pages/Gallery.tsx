import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Gallery() {
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Upload States
    const [imageUrl, setImageUrl] = useState("");
    const [caption, setCaption] = useState("");

    const fetchImages = async () => {
        try {
            const res = await api.get("/gallery");
            setImages(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/gallery", { image_url: imageUrl, caption });
            alert("Image added to gallery! 🎉");
            setImageUrl("");
            setCaption("");
            fetchImages();
        } catch (err) {
            alert("Failed to add image.");
        }
    };

    if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading Gallery... ⏳</div>;

    return (
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto", fontFamily: "sans-serif" }}>
            <button onClick={() => navigate("/dashboard")} style={backBtnStyle}>⬅️ Back to Dashboard</button>
            <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>Activity Gallery 🖼️</h1>

            {/* Upload Form */}
            <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "40px", border: "1px solid #e9ecef" }}>
                <h3 style={{ marginTop: "0", color: "#495057" }}>➕ Add New Photo</h3>
                <form onSubmit={handleUpload} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <input type="url" placeholder="Image URL (e.g., https://example.com/photo.jpg)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required style={{ ...inputStyle, flex: 2, minWidth: "250px" }} />
                    <input type="text" placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} required style={{ ...inputStyle, flex: 1, minWidth: "200px" }} />
                    <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#6f42c1", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                        Add to Gallery
                    </button>
                </form>
            </div>

            {/* Image Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                {images.length === 0 ? <p style={{ textAlign: "center", color: "#777", gridColumn: "1 / -1" }}>No images in the gallery yet.</p> :
                    images.map((img) => (
                        <div key={img.id} style={{ border: "1px solid #ddd", borderRadius: "10px", overflow: "hidden", backgroundColor: "#fff", boxShadow: "0 4px 8px rgba(0,0,0,0.05)" }}>
                            <img src={img.image_url} alt={img.caption} style={{ width: "100%", height: "200px", objectFit: "cover" }} onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/300x200?text=Invalid+Image+URL")} />
                            <div style={{ padding: "15px", textAlign: "center" }}>
                                <p style={{ margin: "0", color: "#444", fontWeight: "bold" }}>{img.caption}</p>
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