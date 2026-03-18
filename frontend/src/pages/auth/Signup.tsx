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
                navigate('/auth');
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
            navigate('/auth');

        } catch (error: any) {
            alert(error.message || "Something went wrong during signup!");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#FAFAFA] font-sans">
            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex w-5/12 bg-[#1A1A1A] p-12 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <Link to="/" className="text-white font-bold text-2xl tracking-tight">CRC.</Link>
                </div>
                <div className="relative z-10 text-white">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">University Volunteer<br />Network</h1>
                    <p className="text-slate-400 text-lg max-w-md font-medium">Join us in driving meaningful social change. Apply for membership to access the portal and participate in upcoming campaigns and activities.</p>
                </div>
                <div className="relative z-10 text-slate-500 text-sm font-medium">
                    © {new Date().getFullYear()} Come for Road Child.
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-md border border-slate-100">

                    <div className="mb-8 border-b border-slate-100 pb-6 text-center lg:text-left">
                        <h2 className="text-2xl font-serif font-bold text-[#222222] tracking-tight">Membership Application</h2>
                        <p className="text-[#666666] mt-2 text-sm font-medium">Please provide accurate academic and personal details. All applications are subject to admin review.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-5">
                        {/* Row 1: Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-[#666666] mb-1.5 ml-1">Full Name *</label>
                            <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 bg-[#F4F4F4]/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none transition-all font-medium text-[#222222] placeholder:text-slate-400" placeholder="John Doe" />
                        </div>

                        {/* Row 2: Email & Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#666666] mb-1.5 ml-1">Email *</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-[#F4F4F4]/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none transition-all font-medium text-[#222222] placeholder:text-slate-400" placeholder="you@university.edu" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#666666] mb-1.5 ml-1">Password *</label>
                                <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-[#F4F4F4]/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none transition-all font-medium text-[#222222] placeholder:text-slate-400" placeholder="••••••••" minLength={6} />
                            </div>
                        </div>

                        {/* Row 3: University & Department */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#666666] mb-1.5 ml-1">University *</label>
                                <input required type="text" name="university" value={formData.university} onChange={handleChange} className="w-full px-4 py-3 bg-[#F4F4F4]/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none transition-all font-medium text-[#222222] placeholder:text-slate-400" placeholder="E.g. Dhaka University" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#666666] mb-1.5 ml-1">Department *</label>
                                <input required type="text" name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-3 bg-[#F4F4F4]/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none transition-all font-medium text-[#222222] placeholder:text-slate-400" placeholder="E.g. Computer Science" />
                            </div>
                        </div>

                        {/* Row 4: Session, Student ID & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#666666] mb-1.5 ml-1">Session *</label>
                                <input required type="text" name="session" value={formData.session} onChange={handleChange} className="w-full px-4 py-3 bg-[#F4F4F4]/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none transition-all font-medium text-[#222222] placeholder:text-slate-400" placeholder="2021-2022" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#666666] mb-1.5 ml-1">Student ID</label>
                                <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} className="w-full px-4 py-3 bg-[#F4F4F4]/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none transition-all font-medium text-[#222222] placeholder:text-slate-400" placeholder="Optional" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#666666] mb-1.5 ml-1">Phone *</label>
                                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-[#F4F4F4]/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D64A26]/20 focus:border-[#D64A26] outline-none transition-all font-medium text-[#222222] placeholder:text-slate-400" placeholder="01XXX..." />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative overflow-hidden group/btn w-full py-4 mt-2 bg-gradient-to-r from-[#D64A26] to-[#F1795D] hover:from-[#c24220] hover:to-[#e36345] text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isLoading ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Submitting Request...</>
                                ) : 'Submit Application'}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-slate-100">
                        <p className="text-[#666666] text-sm font-medium">
                            Already have an account? <Link to="/login" className="text-[#D64A26] font-bold hover:underline">Sign in here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}