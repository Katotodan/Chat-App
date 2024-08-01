import React, {useState} from "react"
import axios from "axios"
import "./navbar.css"
import { Navigate } from "react-router-dom"
import { socket } from "../../socket"

export const Navbar = ({user}) =>{
    const [redirectUser, setRedirectUser] = useState(false)
    const logoutFunc = (e) =>{
        e.preventDefault() 
        axios.post("http://localhost:5000/logout", user
        , {
          withCredentials: true, // Send credentials (cookies)
          headers: {
            'Content-Type': 'application/json',
          //   Authorization: `Bearer ${sessionToken}`, // Include the session token in the Authorization header
          },
        }
        )
        .then((res) => {
            //  Redirect to login
            socket.disconnect()
            setRedirectUser(true)

        })
        .catch(err => console.log(err)) 
    
    }
    const buffer = new Uint8Array([user.image]); 
    const blob =   new Blob([buffer], { type: 'image/jpeg' }); 
    const url = URL.createObjectURL(blob)
    console.log(url)

    return (
        <nav>
            {redirectUser && <Navigate to="/login"/>}
            <div>
                Logo
            </div>
            
            <div className="user">
                <div>
                    <p>{user["username"]}</p>
                    <img src={user.image} alt="" className="userImage" />
                </div>
                <form onSubmit={logoutFunc}>
                    <button type="submit">Log out</button>
                </form>
            </div>
        </nav> 
    )
}