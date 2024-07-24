import React, {useEffect, useState, useRef} from "react";
import "./contact.css"
import axios from "axios";
import { SingleContact } from "./SingleContact";

export const ContactChat = ({setDestination , setDestinationName, currentUser, currentUserId})=>{
    const [contacts, setContact] = useState([])
    const [searchUserValue, setSearchUserValue] = useState("")
    const isInitialRender = useRef(true)

    useEffect( () => {
        axios.get(`http://localhost:5000/conversationList/${currentUserId}`,{
            withCredentials: true, // Send credentials (cookies)
            headers: {
            'Content-Type': 'application/json',
            //   Authorization: `Bearer ${sessionToken}`, // Include the session token in the Authorization header
            },
        })
        .then((res) => {
            setContact([...res.data])
        })
        .catch((err) => console.log(err))
    }, []) 
    useEffect(()=>{
        if (isInitialRender.current) {
            // Skip running the effect on the initial render
            isInitialRender.current = false;
          } else {
            axios.get(`http://localhost:5000/contact/${searchUserValue}`,{
                withCredentials: true, // Send credentials (cookies)
                headers: {
                'Content-Type': 'application/json',
                //   Authorization: `Bearer ${sessionToken}`, // Include the session token in the Authorization header
                },
            })
            .then((res) => {
                setContact([...res.data])
            })
            .catch((err) => console.log(err))
        }
    }, [searchUserValue])

    const handleSearch = (e) =>{
        setSearchUserValue(e.target.value)
    }
    const displayMsg = (element) =>{
        setDestination(element._id)
        setDestinationName(element.username)
    }

    const contact = contacts.map((element, index) =>{
        return <SingleContact element={element} key={element._id} 
        displayMsg={displayMsg} currentUserId ={currentUserId}/>
    })

    return(
        
        <>
            <div className="contacts">
                <div className="search-conversation">
                    <form action="">
                        <input type="text" placeholder="Search by name" 
                        value={searchUserValue} onChange={handleSearch}/>
                        <button>&#8634;</button>
                    </form>
                </div>
                <div className="contact_container">
                    {contact}
                </div>
                
            </div>
        </>
    )
}

//then online date and last message 