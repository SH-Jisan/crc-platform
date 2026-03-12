import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../api/supabase';
import { useAuthStore } from '../../store/authStore';
import  React from "react";
import { getCurrentUser } from '../../api/auth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // ১. Supabase থেকে Auth Check
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            if (data.session && data.user) {
                // ২. আমাদের Zustand Store এ ইউজার ডাটা এবং টোকেন সেভ করা
                login(
                    {
                        id: data.user.id,
                        email: data.user.email!,
                        roles: [], // Role আমরা পরে ডাটাবেস থেকে ফেচ করে আপডেট করবো
                    },
                    data.session.access_token
                );

                try {
                    // ৩. ব্যাকএন্ড থেকে ইউজারের আসল প্রোফাইল এবং Role নিয়ে আসা
                    const userProfile = await getCurrentUser();



                    // ৪. আসল ডাটা দিয়ে Store আপডেট করা
                    login(
                        {
                            id: userProfile.id,
                            email: data.user.email!,
                            full_name: userProfile.full_name,
                            avatar_url: userProfile.avatar_url,
                            roles: userProfile.roles, // ব্যাকএন্ড থেকে ['ADMIN', 'MEMBER'] আসবে
                        },
                        data.session.access_token
                    );
                } catch (dbError) {
                    console.error("Database profile fetch error:", dbError);
                    // প্রোফাইল না পেলেও লগিন কন্টিনিউ করবে
                }

                // ৩. ড্যাশবোর্ডে রিডাইরেক্ট করা
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-500">Sign in to your CRC account</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="admin@crc.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}