import { useEffect,useState } from "react"
import { api } from "../services/api"

export default function AdminDashboard(){

    const [stats,setStats] = useState<any>(null)
    const [events,setEvents] = useState<any[]>([])
    const [donations,setDonations] = useState<any[]>([])

    useEffect(()=>{

        const loadData = async()=>{

            const statsRes = await api.get("/admin/stats")
            const eventsRes = await api.get("/admin/recent-events")
            const donationsRes = await api.get("/admin/recent-donations")

            setStats(statsRes.data)
            setEvents(eventsRes.data)
            setDonations(donationsRes.data)

        }

        loadData()

    },[])

    if(!stats) return <p>Loading...</p>

    return(

        <div>

            <h1>Admin Dashboard</h1>

            <h2>Statistics</h2>

            <p>Total Users: {stats.users}</p>
            <p>Total Events: {stats.events}</p>
            <p>Total Campaigns: {stats.campaigns}</p>
            <p>Total Donations: {stats.totalDonations}</p>

            <h2>Recent Events</h2>

            {events.map(e=>(
                <div key={e.id}>
                    <p>{e.title}</p>
                </div>
            ))}

            <h2>Recent Donations</h2>

            {donations.map(d=>(
                <div key={d.id}>
                    <p>{d.amount}</p>
                </div>
            ))}

        </div>

    )

}