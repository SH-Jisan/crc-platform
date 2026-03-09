import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useAuth } from "../hooks/useAuth"

export default function Navbar(){

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { user } = useAuth()
    const navigate = useNavigate()

    const logout = async () => {

        await supabase.auth.signOut()

        navigate("/login")

    }

    return(

        <nav style={{
            display:"flex",
            gap:"20px",
            padding:"10px",
            borderBottom:"1px solid gray"
        }}>

            <Link to="/">Dashboard</Link>

            <Link to="/events">Events</Link>

            <Link to="/campaigns">Campaigns</Link>

            <Link to="/gallery">Gallery</Link>

            <Link to="/posts">Blog</Link>
            <Link to="/admin">Admin Dashboard</Link>

            {user && (
                <>
                    <Link to="/create-event">Create Event</Link>
                    <button onClick={logout}>Logout</button>
                </>
            )}

            {!user && (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/signup">Signup</Link>
                </>
            )}

        </nav>

    )

}