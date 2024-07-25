import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import { CurrentUserContext } from "../../App";
import { Navigate, Link } from "react-router-dom";
import "./login.css"

export const Login = () =>{
    const {
        currentUser,
        setCurrentUser
    } = useContext(CurrentUserContext)
      
    const [userInfo, setUserInfo] = useState({"username": "", "password": ""})
    const loginFunc = (e) =>{
        e.preventDefault()
        axios.post("http://localhost:5000/login/password", userInfo, {
            withCredentials: true, // Send credentials (cookies)
            headers: {
              'Content-Type': 'application/json',
            //   Authorization: `Bearer ${sessionToken}`, 
            // Include the session token in the Authorization header
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
        <section className="h-screen bg-slate-300 flex items-center justify-center">
            <div className=" md:w-2/4 md:h-3/4 border-2 border-black rounded-md form-container">
                {currentUser && <Navigate to="/"/>}
                <h1 className="text-center text-5xl font-sans my-8">Log in</h1>
                <form onSubmit={loginFunc}
                >
                    <div className="flex items-left flex-col mb-5 gap-2 mx-8 ">
                        <label htmlFor="username"  className="text-3xl">Username</label>
                        <input id="username" name="username" type="text" required 
                        className="block p-1 rounded-md" onChange={handleChange}/>
                    </div>
                    <div className="flex items-left flex-col mb-4 gap-2 mx-8">
                        <label htmlFor="current-password" className="text-3xl">Password</label>
                        <input id="current-password" name="password" type="password" 
                        required className="block p-1 rounded-md" onChange={handleChange}/>
                    </div>
                    <div className="mx-8 mb-7 mt-9">
                        Don't have an account ? 
                        <Link to="/signup" className="inline-block text-orange-500 ml-2 
                        underline-offset-1 text-xl">Sign Up</Link>
                        
                    </div>
                    <button type="submit" className="mx-8 text-2xl bg-gray-200 rounded-md">
                        Log in
                    </button>
                </form>
            </div>
        </section>
        
    )
}

