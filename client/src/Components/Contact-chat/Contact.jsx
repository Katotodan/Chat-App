import React, {useEffect, useState} from "react";
import "./contact.css"
import axios from "axios";

export const ContactChat = ({setDestination , setDestinationName, currentUser})=>{
    const [contacts, setContact] = useState([])

    useEffect( () => {
        axios.get(`http://localhost:5000/conversationList/${currentUser}`,{
            withCredentials: true, // Send credentials (cookies)
            headers: {
            'Content-Type': 'application/json',
            //   Authorization: `Bearer ${sessionToken}`, // Include the session token in the Authorization header
            },
        })
        .then((res) => {
            setContact(prevArray => [...res.data])
        })
        .catch((err) => console.log(err))
    }, [])

    const contact = contacts.map((element, index) =>{
        return (
            <div className="contact-chat" key={element._id} onClick = {() => {
                setDestination(element._id)
                setDestinationName(element.username)
            }}>
                <div className="photo">
                    <img src={element.image} alt="" className="img" />
                </div>
                <div className="name-msg">
                    <p className="name">{element.username}</p>
                    <p>Last message</p>
                </div>
                <div className="time">
                    1:00 pm
                </div>
            </div>
        )
    })

    return(
        
        <>
            <div className="contacts">
                <div className="search-conversation">
                    <form action="">
                        <input type="text" placeholder="Search by name"/>
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