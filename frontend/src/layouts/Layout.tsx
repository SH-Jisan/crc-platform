import Navbar from "../components/Navbar.tsx"

export default function Layout({children}:any){

    return(

        <div>

            <Navbar/>

            <div style={{padding:"20px"}}>

                {children}

            </div>

        </div>

    )

}