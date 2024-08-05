import React, {useState} from "react"
import axios from "axios"
import "./navbar.css"
import { Navigate } from "react-router-dom"
import { socket } from "../../socket"
import logo from "../../asserts/logo.png"

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
                <img src={logo} alt="" className="logo"/>
            </div>
            
            <div className="user">
                <div>
                    <p>{user["username"]}</p>
                    {
                        user.image ? <img src={user.image} alt="" className="userImage" /> :
                        <span className="userImageText bg-slate-300">{user["username"].slice(0,2).toUpperCase()}</span>
                    }
                    
                </div>
                <form onSubmit={logoutFunc}>
                    <button type="submit">Log out</button>
                </form>
            </div>
        </nav> 
    )
}