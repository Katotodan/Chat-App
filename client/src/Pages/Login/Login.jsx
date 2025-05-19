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
    const [redirectUser, setRedictUser] = useState(false)
    
    const [errorMsg, setErrorMsg] = useState(null)
      
    const [userInfo, setUserInfo] = useState({"username": "", "password": ""})
    const loginFunc = (e) =>{
        e.preventDefault()
        console.log('Log in clicked');  
        axios.post(process.env.REACT_APP_API_URL +"/login/password", userInfo, {
            withCredentials: true, // Send credentials (cookies)
            headers: {
              'Content-Type': 'application/json',
            //   Authorization: `Bearer ${sessionToken}`, 
            // Include the session token in the Authorization header
            },
        })
        .then((res) => {
            setCurrentUser({...res.data})
            setRedictUser(true)
        })
        .catch((err) => {
            console.log(err);
            
            setErrorMsg(err.response["data"])
            setTimeout(() => {
                setErrorMsg((prev) => null)
            }, 2000);
        })
    }
    const handleChange = (e) =>{ 
        setUserInfo({
            ...userInfo,
            [e.target.name] : e.target.value,
           
        })
    }
    
    return(
        <section className="h-screen bg-slate-300 flex items-center justify-center">
            <h1 className="absolute top-4 left-0 text-center w-full text-3xl sm:text-4xl">
                Welcome to U-message
            </h1>
            <div className=" md:w-2/4 md:h-3/4 border-2 border-black rounded-md form-container">
                {redirectUser && <Navigate to="/"/>}
                <h1 className="text-center sm:text-3xl text-2xl font-sans my-5">Log in</h1>
            
                <div className="h-6 ml-8 mb-2">
                    {errorMsg && <p className="text-red-600">{errorMsg}</p>}
                </div>
                <form onSubmit={loginFunc}
                >
                    <div className="flex items-left flex-col mb-5 gap-2 mx-8">
                        <label htmlFor="username"  className="text-xl sm:text-2xl">Username</label>
                        <input id="username" name="username" type="text" required 
                        className="block p-1 rounded-md" onChange={handleChange}/>
                    </div>
                    <div className="flex items-left flex-col mb-4 gap-2 mx-8">
                        <label htmlFor="current-password" className="text-xl sm:text-2xl">Password</label>
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

// Working on login page, figure it out why is not redirect for many time

