import axios from "axios";
import { supabase } from "../lib/supabase";

export const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
});

// 🔥 প্রতিটি API কলের আগে স্বয়ংক্রিয়ভাবে টোকেন যুক্ত করার জন্য
api.interceptors.request.use(async (config) => {
    const { data }: any = await supabase.auth.getSession();
    if (data?.session?.access_token) {
        config.headers.Authorization = `Bearer ${data.session.access_token}`;
    }
    return config;
});