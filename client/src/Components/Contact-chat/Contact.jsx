import React from "react";
import "./contact.css"

export const ContactChat = ()=>{
    return(
        <div className="contact-chat">
            <div className="photo">
                <p className="img"></p>
            </div>
            <div className="name-msg">
                <p className="name">Names</p>
                <p>Last message</p>
            </div>
            <div className="time">
                1:00 pm
            </div>
        </div>
    )
}