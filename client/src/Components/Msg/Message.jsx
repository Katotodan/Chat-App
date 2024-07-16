import React,{useRef, useContext, useState, useEffect} from "react";
import "./Message.css"
import axios from "axios";
import { socket } from "../../socket";


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
    const adjustRows = () => {
        const lines = textArea.current.value.split("\n").length;
        textArea.current.rows = lines;
    }

    const messages = msgList.map((element, index) =>{
        return (
            <div key= {index} 
            className={element.receiver == destination ?  " msg-container other" : "msg-container me"}>
                <div>
                    <div className="msg">
                        {element.message}
                    </div>
                    <div className="time">
                        {new Date(element.time).getHours()}: {new Date(element.time).getMinutes()}
                    </div>
                </div>
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

    // socket?.on("sendSpecificMsg", (message) =>{
    //     alert('Someone has send you a message')
    //     setMsgList(prev => [
    //         ...prev, 
    //         {
    //             "message": message,
    //             "sender": "",
    //             "receiver": user.id,
    //             "time": new Date()
    //         }
    //     ])
    // })

    return( 
        <>
            <div className="messages" >
                <h2>To {destinationName}</h2>
                {messages}
            </div>
            <form className="Search-bar" onSubmit={sendMsg}>
                <textarea name="textMessage" id="" rows="1"  ref={textArea} onChange={adjustRows}></textarea>
                <button type="submit" >Send</button>
            </form>
        </>
        
    )
}