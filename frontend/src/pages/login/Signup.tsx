import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../api/supabase';
import { apiClient } from '../../api/axios';

export default function Signup() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // 🌟 State for all member fields
    const [formData, setFormData] = useState({
        fullName: '', email: '', password: '', phone: '',
        university: '', department: '', session: '', studentId: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // ১. Supabase-এ ইউজার একাউন্ট তৈরি (Authentication)
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            if (!data.session) {
                alert("Signup successful! Please check your email to verify your account.");
                navigate('/login');
                return;
            }

            // 🌟 THE FIX: 401 Error ঠেকানোর জন্য সরাসরি নতুন টোকেনটি হেডারে পাঠানো হচ্ছে
            await apiClient.patch('/users/profile', {
                full_name: formData.fullName,
                phone: formData.phone,
                university: formData.university,
                department: formData.department,
                session: formData.session,
                student_id: formData.studentId
            }, {
                headers: {
                    Authorization: `Bearer ${data.session.access_token}` // 🌟 ম্যাজিক ট্রিক!
                }
            });

            alert("Registration successful! 🎉 Your request is pending for Admin approval.");

            // 🌟 সিকিউরিটির জন্য সাইনআপের পর ইউজারকে লগইন পেজে পাঠানো সবচেয়ে নিরাপদ
            navigate('/login');

        } catch (error: any) {
            alert(error.message || "Something went wrong during signup!");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex bg-stone-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">

            {/* 🌟 Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex w-5/12 bg-gradient-to-br from-emerald-600 to-teal-800 p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10">
                    <Link to="/" className="text-white font-extrabold text-3xl tracking-tight">CRC<span className="text-emerald-300">.</span></Link>
                </div>
                <div className="relative z-10 text-white">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Join the<br />CRC Family.</h1>
                    <p className="text-emerald-100 text-lg max-w-md font-medium">Become a part of our volunteer network and help us make a real difference in the community.</p>
                </div>
                <div className="relative z-10 text-emerald-200/60 text-sm font-medium">
                    © {new Date().getFullYear()} Come for Road Child.
                </div>
            </div>

            {/* 🌟 Right Side - Signup Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-xl bg-white p-8 sm:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">

                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-stone-800 tracking-tight">Create Account</h2>
                        <p className="text-stone-500 mt-2 font-medium">Fill in your details to apply for membership.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        {/* Row 1: Full Name */}
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-1.5">Full Name *</label>
                            <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-medium text-stone-700 placeholder:font-normal" placeholder="John Doe" />
                        </div>

                        {/* Row 2: Email & Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Email *</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-medium text-stone-700 placeholder:font-normal" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Password *</label>
                                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-medium text-stone-700 placeholder:font-normal" placeholder="••••••••" minLength={6} />
                            </div>
                        </div>

                        {/* Row 3: University & Department */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">University *</label>
                                <input required type="text" name="university" value={formData.university} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-medium text-stone-700 placeholder:font-normal" placeholder="E.g. Dhaka University" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Department *</label>
                                <input required type="text" name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-medium text-stone-700 placeholder:font-normal" placeholder="E.g. Computer Science" />
                            </div>
                        </div>

                        {/* Row 4: Session, Student ID & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Session *</label>
                                <input required type="text" name="session" value={formData.session} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-medium text-stone-700 placeholder:font-normal" placeholder="2021-2022" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Student ID</label>
                                <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-medium text-stone-700 placeholder:font-normal" placeholder="Optional" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-700 mb-1.5">Phone *</label>
                                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-medium text-stone-700 placeholder:font-normal" placeholder="01XXX..." />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Submitting Request...</>
                            ) : 'Apply for Membership'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-stone-500 font-medium">
                        Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}