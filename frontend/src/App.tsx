import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Events from "./pages/Events"; // 🔥 ADD THIS
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

function App() {
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