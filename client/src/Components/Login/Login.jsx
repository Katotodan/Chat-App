import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import { CurrentUserContext } from "../../App";
import { Navigate } from "react-router-dom";

export const Login = () =>{
    const {
        currentUser,
        setCurrentUser
    } = useContext(CurrentUserContext)
    console.log(currentUser)
      
    const [userInfo, setUserInfo] = useState({"username": "", "password": ""})
    const loginFunc = (e) =>{
        e.preventDefault()
        axios.post("http://localhost:5000/login/password", userInfo, {
            withCredentials: true, // Send credentials (cookies)
            headers: {
              'Content-Type': 'application/json',
            //   Authorization: `Bearer ${sessionToken}`, // Include the session token in the Authorization header
            },
        })
        .then((res) => {
            setCurrentUser(res.data)
        })
        .catch(err => console.log(err))
    }
    const handleChange = (e) =>{
        setUserInfo({
            ...userInfo,
            [e.target.name] : e.target.value,
           
        })
    }
    
    return(
        <div>
            {currentUser == null ? <></> : <Navigate to='/'/>}
            <h1>Sign in</h1>
            <form onSubmit={loginFunc}
            >
                <section>
                    <label htmlFor="username">Username</label>
                    <input id="username" 
                    name="username" 
                    type="text" 
                    onChange={handleChange}/>
                </section>
                <section>
                    <label htmlFor="current-password">Password</label>
                    <input id="current-password" 
                    name="password" 
                    type="password" 
                    onChange={handleChange}/>
                </section>
                <button type="submit">Sign in</button>
            </form>
        </div>
    )
}

