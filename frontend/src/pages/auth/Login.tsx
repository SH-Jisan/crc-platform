import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../api/supabase';
import { useAuthStore } from '../../store/authStore';
import React from "react";
import { getCurrentUser } from '../../api/auth';

const CommunityLogo = () => (
    <div className="w-16 h-16 bg-stone-100 text-[#D64A26] rounded-xl flex items-center justify-center mb-6 border border-stone-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    </div>
);

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // ১. Supabase দিয়ে লগইন করার চেষ্টা
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            if (data.session && data.user) {
                // ২. ব্যাকএন্ড থেকে ইউজারের প্রোফাইল (এবং Status) আনা
                let userProfile;
                try {
                    // টোকেন সেট করার জন্য টেম্পোরারি লগইন
                    login({ id: data.user.id, email: data.user.email!, roles: [] }, data.session.access_token);

                    userProfile = await getCurrentUser();
                } catch (dbError) {
                    console.error("Database profile fetch error:", dbError);
                    throw new Error("Failed to load user profile.");
                }

                // 🌟 THE GATEKEEPER: Status Check
                if (userProfile.status === 'PENDING') {
                    await supabase.auth.signOut(); // জোর করে সাইনআউট
                    useAuthStore.getState().logout(); // স্টোর ক্লিয়ার
                    setError("Your account is still pending admin approval. Please wait.");
                    return;
                }

                if (userProfile.status === 'REJECTED') {
                    await supabase.auth.signOut(); // জোর করে সাইনআউট
                    useAuthStore.getState().logout(); // স্টোর ক্লিয়ার
                    setError("Your membership request has been rejected by the Admin.");
                    return;
                }

                // ৩. যদি APPROVED হয়, তবেই ফাইনাল লগইন করানো হবে
                if (userProfile.status === 'APPROVED' || !userProfile.status) {
                    login(
                        {
                            id: userProfile.id,
                            email: data.user.email!,
                            full_name: userProfile.full_name,
                            avatar_url: userProfile.avatar_url,
                            roles: userProfile.roles || [],
                            status: userProfile.status,
                            crc_id: userProfile.crc_id,
                        },
                        data.session.access_token
                    );
                    navigate('/'); // লগইন সফল! ড্যাশবোর্ডে বা হোমে পাঠিয়ে দাও
                }
            }
        } catch (err: any) {
            // Supabase এর এররগুলো ইউজার ফ্রেন্ডলি করা
            if (err.message === "Invalid auth credentials") {
                setError("Incorrect email or password.");
            } else {
                setError(err.message || 'Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 relative font-sans">
            <div className="w-full max-w-md relative z-10">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-stone-200 flex flex-col items-center">
                    
                    {/* Branding */}
                    <CommunityLogo />
                    <div className="text-center mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
                            Member Portal
                        </h1>
                        <p className="mt-2 text-stone-500 font-medium text-sm">
                            Come for Road Child (CRC)
                        </p>
                    </div>

                    {/* Error Notice */}
                    {error && (
                        <div className="w-full mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-medium flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    <form className="w-full space-y-5" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-1.5 ml-1">Email Address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#D64A26] focus:bg-white outline-none transition-all font-medium text-stone-700 placeholder:text-stone-400"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5 ml-1">
                                <label className="block text-sm font-semibold text-stone-700">Password</label>
                                <button type="button" className="text-sm font-medium text-[#D64A26] hover:text-[#b53d1e] transition-colors">Forgot Password?</button>
                            </div>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#D64A26] focus:bg-white outline-none transition-all font-medium text-stone-700 placeholder:text-stone-400"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-4 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="relative overflow-hidden group/btn w-full py-3.5 mt-2 bg-[#D64A26] hover:bg-[#b53d1e] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            <span className="absolute inset-0 w-full h-full -translate-x-full group-hover/btn:animate-[shine_1.5s_ease] bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12"></span>
                            <span className="relative z-10 flex items-center gap-2">
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-stone-100 w-full text-center">
                        <p className="text-stone-500 text-sm font-medium">
                            Don't have an account? <Link to="/signup" className="text-[#D64A26] font-bold hover:underline">Apply for Membership</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
