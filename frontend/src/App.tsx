import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events"; // 🔥 ADD THIS
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Campaigns from "./pages/Campaigns";
import { useAuth } from "./hooks/useAuth";
import Gallery from "./pages/Gallery"
import Posts from "./pages/Posts"
import Layout from "./layouts/Layout.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";

function App() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { user } = useAuth();

    return (
        <BrowserRouter>
            <Layout>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/events"
                    element={
                        <ProtectedRoute>
                            <Events />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard/>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/campaigns"
                    element={
                        <ProtectedRoute>
                            <Campaigns/>
                        </ProtectedRoute>
                    }
                />
                <Route path="/gallery" element={<Gallery/>}/>
                <Route path="/posts" element={<Posts/>}/>

                {/* Default Redirect */}
                <Route
                    path="/"
                    element={
                        user ? (
                            <Events />
                        ) : (
                            <Login />
                        )
                    }
                />
            </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;