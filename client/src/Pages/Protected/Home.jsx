import {useEffect, useState} from "react";
import { Navbar } from "../../Components/Navbar/Navbar";

import { ContactChat } from "../../Components/Contact-chat/Contact";
import {Msg} from "../../Components/Msg/Message"
import { socket } from "../../socket";
import { useLoaderData } from "react-router-dom";


export const Home = () =>{
    const user = useLoaderData(); 

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [newMsg, setNewMsg] = useState("")
    
    
    useEffect(() =>{ 
        socket.connect()
        socket.emit("user_connect", user.id)
      
        function onDisconnect() {
            setIsConnected(false);
            socket.emit("user_disconnect", user.id)
        }
    
        function sendSpecificMsg([senderId, message]) {
            setNewMsg([senderId, message])
        }     
      
        socket.on('disconnect', onDisconnect);
        socket.on('sendSpecificMsg', sendSpecificMsg);
    
        return () => {
            socket.disconnect();
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
            <Navbar user={user}/>
            <main className="flex relative">
                <div className="contact--container absolute top-0 left-0 w-auto md:static md:flex-1">
                    <ContactChat setDestination = {toUser} 
                    setDestinationName ={toUser_name} currentUserId={user.id}/>    
                </div>
                
                <div className="message--container flex-1 md:flex-[3]">
                    {destination ? (
                        <Msg destination={destination} 
                            destinationName={destinationName} 
                            message = {newMsg}
                            user = {user}
                        />
                    ): (  
                        <div className="welcoming-msg px-3 text-center text-2xl">
                            <h2 className="mt-24">Hey <strong>{user.username}</strong>! <br/> Welcome to U-message!!!</h2>
                            <p className="mt-20 text-center w-full">Select an user to start a conversation 😎😎😎</p>
                        </div>
                    )}
                    
                </div>
            </main> 
        </div>
        
    )
}

// Working on the hom page responsiveness