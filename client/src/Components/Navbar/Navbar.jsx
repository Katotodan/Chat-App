import React, {useContext} from "react"
import axios from "axios"
import "./navbar.css"
import { CurrentUserContext } from "../../App"




export const Navbar = () =>{
    const {
        currentUser,
        setCurrentUser
    } = useContext(CurrentUserContext)

    const logoutFunc = (e) =>{
        e.preventDefault() 
        axios.post("http://localhost:5000/logout", currentUser
        , {
          withCredentials: true, // Send credentials (cookies)
          headers: {
            'Content-Type': 'application/json',
          //   Authorization: `Bearer ${sessionToken}`, // Include the session token in the Authorization header
          },
      }
      )
      .then((res) => {
          setCurrentUser(null)   
      })
      .catch(err => console.log(err)) 
    
    }
    const buffer = new Uint8Array([currentUser?.image]); 
    const blob =   new Blob([buffer], { type: 'image/jpeg' }); 
    const url = URL.createObjectURL(blob)
    console.log(url)

    return (
        <nav>
            <div>
                Logo
            </div>
            
            <div className="user">
                <div>
                    <p>{currentUser["username"]}</p>
                    <img src={url} alt="" className="userImage" />
                </div>
                <form onSubmit={logoutFunc}>
                    <button type="submit">Log out</button>
                </form>
            </div>
        </nav>
    )
}