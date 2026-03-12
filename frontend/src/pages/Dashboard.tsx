import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
    const { user, logout } = useAuthStore();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p className="mb-4">Welcome back, {user?.full_name || 'Admin'}!</p>
            <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
}