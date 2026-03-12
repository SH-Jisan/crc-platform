import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
    const { user, logout } = useAuthStore();

    // ইউজার ADMIN কিনা তা চেক করার লজিক
    const isAdmin = user?.roles?.includes('ADMIN');

    return (
        <div className="min-h-screen p-8 bg-slate-50">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 p-8">

                {/* Header Section */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-500 mt-1">Welcome back to CRC Platform</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors cursor-pointer"
                    >
                        Sign Out
                    </button>
                </div>

                {/* User Profile & Role Card */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex items-center gap-6">
                    <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-blue-200 shadow-sm">
                        {user?.full_name?.charAt(0) || user?.email.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-slate-800">
                            {user?.full_name || 'No Name Set'}
                        </h2>
                        <p className="text-slate-500 mb-3">{user?.email}</p>

                        {/* 🌟 Role UI Section 🌟 */}
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-500 font-medium">Your Roles:</span>

                            {user?.roles && user.roles.length > 0 ? (
                                user.roles.map((role) => (
                                    <span
                                        key={role}
                                        className={`px-3 py-1 text-xs font-bold rounded-full tracking-wider ${
                                            role === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-700 border border-purple-200' // এডমিনদের জন্য পার্পল কালার
                                                : 'bg-blue-100 text-blue-700 border border-blue-200'       // মেম্বারদের জন্য ব্লু কালার
                                        }`}
                                    >
                    {role}
                  </span>
                                ))
                            ) : (
                                <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full border border-gray-200">
                  USER (No Roles Assigned)
                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* 👑 Conditional UI: শুধু ADMIN রাই এই সেকশন দেখতে পাবে */}
                {isAdmin && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-white rounded-xl border border-purple-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">👑</span>
                            <h3 className="text-lg font-bold text-purple-900">Admin Controls</h3>
                        </div>
                        <p className="text-purple-700 mb-5 text-sm">
                            Since you have ADMIN privileges, you can access the following management tools:
                        </p>

                        <div className="flex gap-4">
                            <button className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium shadow-sm transition-all cursor-pointer">
                                Manage Users
                            </button>
                            <button className="px-5 py-2.5 bg-white text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-50 font-medium transition-all cursor-pointer">
                                View Audit Logs
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}