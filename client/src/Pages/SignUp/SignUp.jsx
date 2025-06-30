import React, {useState, useEffect, useContext, useRef} from "react";
import axios from "axios";
import { CurrentUserContext } from "../../App";
import { Navigate, Link } from "react-router-dom";

export const SingUp = () =>{
      
    const [userInfo, setUserInfo] = useState({"username": "", "password": ""})
    const [errorMsg, setErrorMsg] = useState(null)
    const [navigateToHome, setNavigateToHome] = useState(false)

     // Selecting a file
     const selectImgBtn = useRef(null)
     const imgContainer = useRef(null)
     const [image, setImage] = useState(null)
     const [displayImg, setDisplayImg] = useState(false)

    const singUpFunc = (e) =>{
        e.preventDefault() 
        const userData = {
            ...userInfo,
            "image": image
        }        

        axios.post(process.env.REACT_APP_API_URL + "/signup", userData, {
            withCredentials: true, // Send credentials (cookies)
            headers: {
              'Content-Type': 'application/json',
            //   Authorization: `Bearer ${sessionToken}`, // Include the session token in the Authorization header
            },
        })
        .then(res => {
            // Navigate to main
            setNavigateToHome(true)
        })
        .catch(err => {
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
    
    // Selecting a file
    
    const addingImg = async (e) =>{
        console.log(e.target);
        const file = selectImgBtn.current.files[0]
        if(file){
            const reader = new FileReader();
            
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
            selectImgBtn.current.textContent = "File selected"
            imgContainer.current.src =  URL.createObjectURL(file) 
            setDisplayImg(true)
        } 
    }
    const removePhoto = ()=>{
        setImage(null)
        imgContainer.current.src=""
        setDisplayImg(false)
    }
    
    return(
        <section className="min-h-dvh  bg-slate-300 flex items-center justify-center flex-col
        landscape-sm:overflow-y-scroll landscape-sm:h-auto gap-3 md:gap-5 lg:gap-9">
            <h1 className="text-center w-full text-3xl sm:text-4xl">
                Welcome to U-message
            </h1>
            <div className="w-full h-[90%] md:w-[75%] md:h-[80%] ls:w-2/4 ls:h-3/4 border-2 
            border-transparent md:border-black rounded-md form-container pb-2
            landscape-sm:h-auto  landscape-sm:mb-2">
                {navigateToHome && <Navigate to="/"/>}
                <h1 className="text-center sm:text-3xl text-2xl font-sans my-6">Sign up</h1>
                <div className="h-6 ml-8 mb-2">
                    {errorMsg && <p className="text-red-600">{errorMsg}</p>}
                </div>
                
                <form onSubmit={singUpFunc}
                >
                    <div className="flex items-left flex-col mb-5 gap-2 mx-8 ">
                        <label htmlFor="username" className="text-xl sm:text-2xl">Username</label>
                        <input id="username" className="block p-1 rounded-md" 
                        name="username" type="text" onChange={handleChange} required/>
                    </div>
                    <div className="flex items-left flex-col mb-5 gap-2 mx-8 ">
                        <label htmlFor="current-password" className="text-xl sm:text-2xl">Password</label>
                        <input id="current-password" className="block p-1 rounded-md"
                        name="password" type="password" onChange={handleChange} required/>
                    </div>
                    <div className="flex items-left flex-col mb-5 gap-2 mx-8 ">
                        <label className="cursor-pointer bg-slate-100 
                        rounded-md inline-block w-44 p-2">
                            Add a profil picture
                            <input type="file" id="imageInput" onChange={addingImg} 
                            ref={selectImgBtn} accept="image/*" className="hidden"/>
                        </label>
                        <img id="imageContainer" ref={imgContainer} className="max-h-96 object-cover"></img>
                    </div>
                    {displayImg && <>
                        <button type="button" className="inline-block w-auto bg-gray-200 
                        text-red-600 ml-8 rounded-md" onClick={removePhoto}>
                            Remove
                        </button>
                    </>} 
                        
                    
                    <div className="mx-8 mb-5 mt-9">
                        Already have an account? 
                        <Link to={"/login"} className="inline-block text-orange-500 ml-2 
                        underline-offset-1 text-xl">Log in</Link>
                    </div>
                    <button type="submit" className="mx-8 ms:text-2xl text-xl bg-gray-200 mb-3 rounded-md">
                        Sign Up
                    </button>
                </form>
            </div>
        </section>
        
    )
   
}

