import React,{useRef, useContext, useState, useEffect} from "react";
import "./Message.css"
import axios from "axios";
import { socket } from "../../socket";
import { SingleMsg } from "./SingleMsg";


export const Msg = ({destination, destinationName, message, user}) =>{
    const [msgList, setMsgList] = useState([])
   
    // Get the message
    useEffect(() =>{
        axios.get(`http://localhost:5000/getMsg/${user.id}/${destination}`,{
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
        if(message[0] ===destination ){
            setMsgList(prev => [
                ...prev, 
                {
                    "message": message[1],
                    "sender": "",
                    "receiver": user.id,
                    "time": new Date()
                }
            ])  
        }
        
    }, [message])

    const textArea = useRef(null)
    let previousDate = []

    const adjustRows = () => {
        const lines = textArea.current.value.split("\n").length;
        textArea.current.rows = lines;
    }



    const messages = msgList.map((element, index) =>{

        const dateObject = new Date(element.time);
        const inputYear = dateObject.getFullYear()
        const inputMonth = dateObject.getMonth()
        const inputDay = dateObject.getDate()

        const currentYear = new Date().getFullYear()
        const currentMonth = new Date().getMonth()
        const currentDay = new Date().getDate()

        const newTime = [inputDay, inputMonth, inputYear]
        let outPutDate = ""
        if(inputDay === currentDay && inputMonth === currentMonth && inputYear === currentYear){
            if(newTime[0] !== previousDate[0]){
                previousDate = newTime
                outPutDate = "Today"
            }
        }else if(inputDay === currentDay -1 && inputMonth === currentMonth && inputYear === currentYear){
            if(newTime[0] !== previousDate[0]){
                previousDate = newTime
                outPutDate = "Yesterday"
            }
        }else{
            if(newTime[0] !== previousDate[0] && newTime[1] !== previousDate[1] && newTime[2] !== previousDate[2]){
                previousDate = newTime
                outPutDate = inputDay + "th " + inputMonth + ", " + inputYear
            }
        }



        return (
            <div key={index}>
                <h3 className="message-date">{outPutDate}</h3>
                <SingleMsg msg={element} destination={destination}/>
            </div>
            
        )
    })
    const sendMsg = async (e) =>{
        e.preventDefault()
        axios.post(`http://localhost:5000/postMsg/${user.id}/${destination}`,
        {"textMessage" : textArea.current.value}, {
            withCredentials: true, // Send credentials (cookies)
            headers: {
            'Content-Type': 'application/json',
            },
        })
        .then( (res) => {
            socket?.emit("messageSend", [textArea.current.value, destination])
            setMsgList(prev => [...prev, 
                {
                    "message": textArea.current.value,
                    "sender": user.id,
                    "receiver": destination,
                    "time": new Date()
                }
            ])  
        })
        .catch(err => console.log(err))   
    }

    return( 
        <>
            <div className="messages" >
                <h2>Chat with {destinationName}</h2>
                {messages}
            </div>
            <form className="Search-bar" onSubmit={sendMsg}>
                <textarea name="textMessage" id="" rows="1"  ref={textArea} onChange={adjustRows}></textarea>
                <button type="submit" >Send</button>
            </form>
        </>
        
    )
}