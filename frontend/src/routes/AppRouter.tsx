import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login/Login.tsx';
import Dashboard from '../pages/dashboard/Dashboard.tsx';
import ProtectedRoute from './ProtectedRoute';
import Events from "../pages/events/Events.tsx";
import MainLayout from "../components/layout/MainLayout.tsx";

export default function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout/>}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events/>}/>

                {/* Protected Routes (Shudhu login kora user ra pabe) */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    {/* Vobishhote aaro private route ekhane asbe jemon /events/create */}
                </Route>
            </Route>
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}