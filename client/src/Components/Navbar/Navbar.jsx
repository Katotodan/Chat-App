import {useState, useEffect, useRef} from "react"
import axios from "axios"
import "./navbar.css"
import { Navigate } from "react-router-dom"
import { socket } from "../../socket"
import logo from "../../asserts/logo.png"
import { useLocation } from "react-router-dom"

export const Navbar = ({user}) =>{
    const [redirectUser, setRedirectUser] = useState(false)
    const [showLogout, setShowLogout] = useState(false);
    const menuContentRef = useRef(null)
    let location = useLocation()

    const toggleLogout  = () =>{ setShowLogout(prev => !prev)}

    useEffect(()=>{
        const handleClickOutside = (event) => {
            if(event.target.dataset.role !== 'menu'){
                if (menuContentRef.current && !menuContentRef.current.contains(event.target)) {
                    setShowLogout(false);
                }
            }  
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])
    useEffect(() => {
        setShowLogout(false)
    }, [location]);
    const handleLogout = (e) =>{
        e.preventDefault() 
        axios.post(process.env.REACT_APP_API_URL +"/logout", user, {
            withCredentials: true, // Send credentials (cookies)
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((res) => {
            socket.disconnect()
            setRedirectUser(true)
        })
        .catch((err) => {
            console.error(err);
        })
    }
    
    

    return (
        <nav>
            {redirectUser && <Navigate to="/login"/>}
            <div>
                <img src={logo} alt="" className="logo"/>
            </div>
            <div className={`user ${showLogout ? " expanded" : ""}`}>
                <div>
                    {
                        user.image ? <img src={user.image} alt="" className="userImage" onClick={toggleLogout} data-role="menu"/> :
                        <span className="userImageText bg-slate-300" data-role="menu" 
                        onClick={toggleLogout}>{user["username"].slice(0,2).toUpperCase()}</span>
                    }
                </div>
                <div ref={menuContentRef}>
                    <p className={showLogout ? "username-responsive" : "username"}>{user["username"]}</p>
                    
                    <form onSubmit={handleLogout} >
                    <button type="submit">Log out</button> 
                </form>
                </div>
                
            </div>
        </nav> 
    )
}