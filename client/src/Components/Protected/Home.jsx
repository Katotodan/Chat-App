import React, {useContext, useEffect, useState} from "react";
import { CurrentUserContext } from "../../App";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./Home.css"
import { Navbar } from "../Navbar/Navbar";

import { ContactChat } from "../Contact-chat/Contact";
import { Msg } from "../Msg/Message";

import { socket } from "../../socket";


export const Home = () =>{
    const {
        currentUser,
        setCurrentUser
    } = useContext(CurrentUserContext)
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [newMsg, setNewMsg] = useState("")

    useEffect(() =>{ 
        socket.connect()
        socket.emit("user_connect", currentUser?.id)
      
        function onDisconnect() {
            setIsConnected(false);
            socket.emit("user_disconnect", currentUser.id)
        }
    
        function sendSpecificMsg(message) {
            alert("alert user")
            setNewMsg(message)
        }     
      
        socket.on('disconnect', onDisconnect);
        socket.on('sendSpecificMsg', sendSpecificMsg);
    
        return () => {
        socket.off('connect');
        socket.off('disconnect', onDisconnect);
        socket.off('sendSpecificMsg', sendSpecificMsg);
        };
        
    },[]) 
    

    const [destination, setDestination] = useState("")
    const [destinationName, setDestinationName] = useState("")
    
    const toUser = (id) =>{
        setDestination(id) 
    }
    const toUser_name = (name) =>{
        setDestinationName(name)
    }
    
    
    return(        
        <div>
            {
                currentUser ? (
                    <>
                        <Navbar/>
                        <main>
                            <ContactChat setDestination = {toUser} 
                            setDestinationName ={toUser_name} currentUser ={currentUser.username}/>
                            <div className="message--container">
                            {destination ? (
                                <Msg destination={destination} 
                                  destinationName={destinationName} 
                                  message = {newMsg}
                                />
                            ): (
                                <>
                                    <h2>Hey! Welcome to U-message!!!</h2>
                                    <h3>Select an user to start a conversation 😎😎😎</h3>
                                </>
                            )}
                                
                            </div>
                        </main>
                    </>
                ) : <Navigate to='/login'/>
            }
        </div>
        
    )
}