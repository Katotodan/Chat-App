import {useState, useEffect, useRef} from "react";
import "./Message.css"
import axios from "axios";
import { SingleMsg } from "./SingleMsg";
import { Textarea } from "./Textarea";
import { socket } from "../../socket";
import { emitter } from '../../socket'

export const Msg = ({destination, destinationName, message, user}) =>{
    const [msgList, setMsgList] = useState([])
    const msgContainerRef = useRef(null);
   
    // Get the message
    useEffect(() =>{
        axios.get(`${process.env.REACT_APP_API_URL}/getMsg/${user.id}/${destination}`,{
            withCredentials: true, // Send credentials (cookies)
            headers: {
            'Content-Type': 'application/json',
            },
        })
        .then((res) => {
            setMsgList(res.data)
        })
        .catch((err) => console.log(err))
    }, [destination])
    
    useEffect(() =>{
        setMsgList(prev => [
            ...prev, 
            message
        ])
    }, [message])

    useEffect(() => {
        if (msgContainerRef.current) {
        msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight;
        }
    }, [msgList.length]);

    let previousDate = []

    const messages = msgList.map((element, index) =>{

        const messageYear = new Date(element.time).getFullYear()
        const messageMonth = new Date(element.time).getMonth()
        const messageDay = new Date(element.time).getDate()

        const currentYear = new Date().getFullYear()
        const currentMonth = new Date().getMonth()
        const currentDay = new Date().getDate()

        const newTime = [messageDay, messageMonth, messageYear]
        let outPutDate = ""
        if(messageDay === currentDay && messageMonth === currentMonth && messageYear === currentYear){
            if(newTime[0] !== previousDate[0]){
                previousDate = newTime
                outPutDate = "Today"
            }
        }else if(messageDay === currentDay -1 && messageMonth === currentMonth && messageYear === currentYear){
            if(newTime[0] !== previousDate[0]){
                previousDate = newTime
                outPutDate = "Yesterday"
            }
        }else{
            if(newTime[0] !== previousDate[0] && newTime[1] !== previousDate[1] && newTime[2] !== previousDate[2]){
                previousDate = newTime
                outPutDate = messageDay + "/" + messageMonth + "/" + messageYear
            }
        }

        return (
            <div key={index}>
                {outPutDate && <h3 className="message-date">{outPutDate}</h3>}
                <SingleMsg msg={element} destination={destination}/>
            </div>
            
        )
    })
    const addToMessage = (e)=>{
        axios.post(`${process.env.REACT_APP_API_URL}/postMsg/${user.id}/${destination}`,
            {"textMessage" : e}, {
                withCredentials: true, // Send credentials (cookies)
                headers: {
                'Content-Type': 'application/json',
                },
            })
            .then( (res) => {
                const message = {
                        "message": e,
                        "sender": user.id,
                        "receiver": destination,
                        "time": new Date(),
                        "_id": res.data._id
                    }
                socket?.emit("messageSend", [message, destination]) 
                setMsgList(prev => [...prev, message])  
                // Send eventemitter to the contact, so that it update the contact list
                // Use mitt library to emit
                emitter.emit('updateContactList')
            })
            .catch(err => console.error(err))
         
    }

    return( 
        <div className="allMsg-container">
            <div className="messages" ref={msgContainerRef}>
                <h2>Chat with <strong>{destinationName}</strong></h2>
                {messages}   
            </div>
            <Textarea addMessage={addToMessage} destination={destination}/>  
        </div>  
    ) 
}