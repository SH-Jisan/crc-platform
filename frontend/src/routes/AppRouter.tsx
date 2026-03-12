import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login/Login.tsx';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes (Shudhu login kora user ra pabe) */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                {/* Vobishhote aaro private route ekhane asbe jemon /events/create */}
            </Route>
        </Routes>
    );
}