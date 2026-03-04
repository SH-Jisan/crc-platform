import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {

    const navigate = useNavigate();

    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [location,setLocation] = useState("");
    const [date,setDate] = useState("");

    const createEvent = async () => {

        await api.post("/events",{
            title,
            description,
            location,
            event_date: date
        });

        alert("Event Created");

        navigate("/events");
    };

    return (
        <div>

            <h1>Create Event</h1>

            <input placeholder="Title" onChange={(e)=>setTitle(e.target.value)} />

            <input placeholder="Description" onChange={(e)=>setDescription(e.target.value)} />

            <input placeholder="Location" onChange={(e)=>setLocation(e.target.value)} />

            <input type="datetime-local" onChange={(e)=>setDate(e.target.value)} />

            <button onClick={createEvent}>Create</button>

        </div>
    );
}