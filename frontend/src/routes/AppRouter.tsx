import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/login/Login.tsx';
import Dashboard from '../pages/dashboard/Dashboard.tsx';
import ProtectedRoute from './ProtectedRoute';
import Events from "../pages/events/Events.tsx";
import MainLayout from "../components/layout/MainLayout.tsx";
import Campaigns from "../pages/campaigns/Campaigns.tsx";
import CustomCauseDonation from "../pages/donations/CustomCauseDonation.tsx";
import CommunityFeed from "../pages/posts/CommunityFeet.tsx";
import SinglePost from "../pages/posts/SinglePost.tsx";

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
                <Route path="/posts" element={<CommunityFeed/>}/>
                <Route path="/campaigns" element={<Campaigns/>} />
                <Route path="/donations" element={<CustomCauseDonation/>}/>
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/post/:id" element={<SinglePost />} />
        </Routes>
    );
}