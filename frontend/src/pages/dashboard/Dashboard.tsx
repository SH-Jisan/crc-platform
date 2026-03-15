import { useState } from 'react';
import { useAuthStore } from '../../store/authStore.ts';
import CreateCustomCauseDonationModal from '../donations/CreateCustomCauseDonationModal.tsx';
import CreatePostModal from "../posts/CreatePostModal.tsx";
import ManageMembersModal from "./ManageMembersModal.tsx"; // 🌟 Modal Import

// SVG Icons
const CrownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 16.5 3 6l4.5 3.5L12 3l4.5 6.5L21 6l.5 10.5Z" />
        <path d="M2.5 16.5h19" />
    </svg>
);

const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const HeartHandshakeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
        <path d="m18 15-2-2" />
        <path d="m15 18-2-2" />
    </svg>
);

const SignOutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

export default function Dashboard() {
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);

    // 🌟 Modal State
    const [isDonationFormOpen, setIsDonationFormOpen] = useState(false);

    // ইউজার ADMIN কিনা তা চেক করার লজিক
    const isAdmin = user?.roles?.includes('ADMIN');

    // Get initials safely
    const getInitials = () => {
        if (!user) return '?';
        if (user.full_name) {
            const names = user.full_name.split(' ');
            if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
            return names[0][0].toUpperCase();
        }
        return user.email?.charAt(0).toUpperCase() || '?';
    };

    return (
        <div className="min-h-screen py-16 px-6 bg-[#FAFAFA] font-sans selection:bg-emerald-100 selection:text-emerald-900">
            <div className="max-w-5xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 relative">
                    <div className="relative z-10 w-full sm:w-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-semibold mb-6 border border-emerald-100/50 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Dashboard Overview</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-stone-800 tracking-tight leading-[1.15]">
                            Welcome, <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-500 to-teal-500">{user?.full_name?.split(' ')[0] || 'Member'}</span>
                        </h1>
                        <p className="mt-4 text-lg text-stone-500 font-medium">
                            Manage your community activities and contributions.
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="shrink-0 px-6 py-3 bg-red-50/50 text-red-600 font-bold rounded-xl hover:bg-red-500 hover:text-white shadow-sm border border-red-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                    >
                        <SignOutIcon />
                        Sign Out
                    </button>
                </div>

                {/* User Profile Card */}
                <div className="bg-white rounded-4xl border border-stone-100/80 p-8 md:p-10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] relative overflow-hidden group">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60"></div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                        <div className="w-28 h-28 shrink-0 bg-linear-to-br from-emerald-100 to-teal-100 text-emerald-700 rounded-full flex items-center justify-center text-4xl font-extrabold border-4 border-white shadow-[0_4px_20px_rgb(0,0,0,0.06)] ring-1 ring-stone-100/50">
                            {getInitials()}
                        </div>

                        <div className="flex-1 text-center sm:text-left flex flex-col justify-center h-full">
                            <h2 className="text-3xl font-extrabold text-stone-800 mb-1">
                                {user?.full_name || 'Anonymous User'}
                            </h2>
                            <p className="text-stone-500 text-lg font-medium mb-6">{user?.email}</p>

                            {/* 🌟 Role UI Section 🌟 */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                                <span className="text-sm uppercase tracking-wider font-bold text-stone-400 mt-1">Assigned Roles</span>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    {user?.roles && user.roles.length > 0 ? (
                                        user.roles.map((role) => (
                                            <span
                                                key={role}
                                                className={`px-4 py-1.5 text-xs font-bold rounded-full tracking-wide uppercase shadow-sm border ${
                                                    role === 'ADMIN'
                                                        ? 'bg-amber-50 text-amber-700 border-amber-200/50'
                                                        : 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                                                }`}
                                            >
                                                {role === 'ADMIN' ? '👑 ' : ''}{role}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="px-4 py-1.5 bg-stone-50 text-stone-500 text-xs font-bold rounded-full border border-stone-200 shadow-sm uppercase">
                                            Member
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 👑 Conditional UI: শুধু ADMIN রাই এই সেকশন দেখতে পাবে */}
                {isAdmin && (
                    <div className="mt-8 bg-linear-to-br from-stone-900 to-stone-800 rounded-4xl border border-stone-800 p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group">
                        {/* Decorative Admin Background Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-500/15 transition-colors duration-700"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

                        <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-8 text-center xl:text-left">
                            <div className="max-w-md">
                                <div className="flex items-center justify-center xl:justify-start gap-3 mb-4">
                                    <div className="p-2.5 bg-white/10 rounded-xl text-amber-400 shadow-[0_4px_15px_rgb(0,0,0,0.2)]">
                                        <CrownIcon />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight">Admin Privileges</h3>
                                </div>
                                <p className="text-stone-400 text-[1.05rem] font-medium leading-relaxed">
                                    Since you have ADMIN privileges, you have complete access to specialized management tools for users and platform logs.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row flex-wrap justify-center xl:justify-end gap-4 w-full xl:w-auto shrink-0">

                                {/* 🌟 The New Create Donation Button */}
                                <button
                                    onClick={() => setIsDonationFormOpen(true)}
                                    className="px-7 py-4 bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-[0_4px_15px_rgb(244,63,94,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer w-full sm:w-auto"
                                >
                                    <HeartHandshakeIcon />
                                    Emergency Fund
                                </button>
                                <button
                                    onClick={() => setIsPostModalOpen(true)}
                                    className="px-7 py-4 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl shadow-[0_4px_15px_rgb(16,185,129,0.3)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer w-full sm:w-auto"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                                    Create Story / Post
                                </button>

                                <button
                                    onClick={()=> setIsManageMembersOpen(true)}
                                    className="px-7 py-4 bg-white text-stone-900 font-bold rounded-xl hover:bg-stone-100 shadow-[0_4px_15px_rgb(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer w-full sm:w-auto">
                                    <UsersIcon />
                                    Manage Users
                                </button>

                            </div>
                        </div>
                    </div>
                )}

                {/* 🌟 Custom Cause (Donation Form) Modal */}
                <CreateCustomCauseDonationModal
                    isOpen={isDonationFormOpen}
                    onClose={() => setIsDonationFormOpen(false)}
                />
                <CreatePostModal
                    isOpen={isPostModalOpen}
                    onClose={() => setIsPostModalOpen(false)}
                />
                <ManageMembersModal
                    isOpen={isManageMembersOpen}
                    onClose={() => setIsManageMembersOpen(false)}
                />

            </div>
        </div>
    );
}