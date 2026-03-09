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
function App() {
    // @ts-ignore
    const { user } = useAuth();

    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}

export default App;