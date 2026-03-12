import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuthStore();

    // Jodi login kora na thake, tahole jor kore Login page e pathiye dibe
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Jodi login kora thake, tahole asol page ta dekhabe (Outlet mane vitorer route)
    return <Outlet />;
}