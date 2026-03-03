import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Test() {
    const [data, setData] = useState("");

    useEffect(() => {
        api.get("/users")
            .then((res) => {
                // 🔥 res.data.message er bodole direct data ta string e convert kore show korchi test korar jonno
                setData(JSON.stringify(res.data, null, 2));
            })
            .catch((err) => {
                console.error("API Error:", err);
                setData("Error loading data");
            });
    }, []);

    // 💡 Pre tag use korle JSON data dekhte shundor lagbe
    return (
        <div>
            <h1>Users List:</h1>
            <pre>{data || "Loading..."}</pre>
        </div>
    );
}