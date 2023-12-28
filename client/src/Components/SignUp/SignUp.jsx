import React, {useState, useEffect, useContext, useRef} from "react";
import axios from "axios";
import { CurrentUserContext } from "../../App";
import { Navigate, Link } from "react-router-dom";
//import "./signup.css"

export const SingUp = () =>{
    const {
        currentUser,
        setCurrentUser
    } = useContext(CurrentUserContext)
      
    const [userInfo, setUserInfo] = useState({"username": "", "password": ""})
    const [errorMsg, setErrorMsg] = useState(null)

     // Selecting a file
     const selectImgBtn = useRef(null)
     const imgContainer = useRef(null)
     const [imageUrl, setImageUrl] = useState("")

    const singUpFunc = (e) =>{
        e.preventDefault() 
        axios.post("http://localhost:5000/signup", {
            ...userInfo, 
            "imageUrl" : imageUrl
        }, {
            withCredentials: true, // Send credentials (cookies)
            headers: {
              'Content-Type': 'application/json',
             // Authorization: `Bearer ${sessionToken}`, // Include the session token in the Authorization header
            },
        })
        .then((res) => {
            setCurrentUser(res.data)
        })
        .catch(err => {
            
            setErrorMsg(err)
            console.log(err)
        })
    }
    const handleChange = (e) =>{
        setUserInfo({
            ...userInfo,
            [e.target.name] : e.target.value,
           
        })
    }
    
    // Selecting a file
    
    const addingImg = async () =>{
        const file = selectImgBtn.current.files[0]
        if(file){
            const image = URL.createObjectURL(file) 
            setImageUrl(image)
            imgContainer.current.src = image  
        }
    }
    
    return(
        <div>
            {currentUser == null ? <></> : <Navigate to='/'/>}
            <h1>Sign up</h1>
            {/* {errorMsg && <>{errorMsg}</>} */}
            <form onSubmit={singUpFunc}
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
                <section>
                    <label htmlFor="current-password">Add a profil picture</label>
                    <input type="file" id="imageInput" onChange={addingImg} ref={selectImgBtn} accept="image/*"/>
                    <img id="imageContainer" ref={imgContainer}></img>
                </section>
                <div>
                    Already have an account? <Link to={"/login"}>Log in</Link>
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    )
   
}

