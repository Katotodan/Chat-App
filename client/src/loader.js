import axios from "axios"
import { redirect } from 'react-router-dom';

export const loaderFunction = () =>{
    //send request to '/',
    return (
        axios.get("http://localhost:5000/",{
        withCredentials: true, // Send credentials (cookies)
        headers: {
            'Content-Type': 'application/json',
        },
        }).then(res => {
        if(res.data === "Login"){
            return redirect('/login');
        }
        console.log(res.data);
        return res.data
        })
        .catch(err => {
            console.log(err)
            return redirect('/login');
        })
    )
      
}

export const loaderFunctionOnLogin = () =>{
    //send request to '/',
    return (
        axios.get("http://localhost:5000/",{
        withCredentials: true, // Send credentials (cookies)
        headers: {
            'Content-Type': 'application/json',
        },
        }).then(res => {
        if(res.data === "Login"){
            return null;
        }else{
            return redirect("/")
        }
        
        })
        .catch(err => {
            console.log(err)
            return null;
        })
    )
      
}