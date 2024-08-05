import React, {useEffect, useState, useRef} from "react";
import "./contact.css"
import axios from "axios";
import { SingleContact } from "./SingleContact";
import { SearchContact } from "./SearchContact";

export const ContactChat = ({setDestination , setDestinationName, currentUser, currentUserId})=>{
    const [contacts, setContact] = useState([])
    

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
    

    const displayMsg = (element) =>{
        setDestination(element._id)
        setDestinationName(element.username)
    }
    const updateContact =(e)=>{
        setContact([...e])
    }

    const contact = contacts.map((element, index) =>{
        return <SingleContact element={element} key={element._id} 
        displayMsg={displayMsg} currentUserId ={currentUserId}/>
    })

    return(
        
        <>
            <div className="contacts-section">
                <SearchContact updateContact = {updateContact} currentUserId= {currentUserId} />
                <div className="contact_container">
                    {contact.length > 0 ? <>{contact}</>:<>
                        <span className="no-conversation">There were no conversations found!</span> 
                    </>}
                    
                    
                </div>
                
            </div>
        </>
    )
}

//then online date and last message 