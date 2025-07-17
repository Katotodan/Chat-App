import axios from 'axios'
import {useState, useRef} from 'react'
import { emitter } from '../../socket'


export const SingleMsg = ({msg, destination}) => {
    const [displayDeletebtn, setDisplayDeletebtn] = useState(false)
    const msgRef = useRef(null)
    const handleMsgClick = ()=> setDisplayDeletebtn(prev => !prev)
        
    const deleteMsg = ()=>{
        axios.delete(`${process.env.REACT_APP_API_URL}/deleteMsg/${msg._id}`,
            {
              withCredentials: true, // Send credentials (cookies)
              headers: {
                'Content-Type': 'application/json',
              //   Authorization: `Bearer ${sessionToken}`, // Include the session token in the Authorization header
              },
            }).then((res) => {
                //  Display none the message
                msgRef.current.style.display = "none"
                // Send eventemitter to the contact, so that it update the contact list
                // Use mitt library to emit
                emitter.emit('updateContactList')
    
            }).catch(err => console.error(err)
        ) 
    }
    const msgHour = new Date(msg.time).getHours()
    const msgMinute = new Date(msg.time).getMinutes()
  return (
    <div className={msg.receiver == destination ?  "msg-container me" : "msg-container other"}
    ref={msgRef}>
        <div onClick={handleMsgClick}>
            <div className="msg">
                {msg.message}
            </div>
            <div className="time">
                {msgHour > 9 ? msgHour : `0${msgHour}`}: {msgMinute > 9 ? msgMinute : `0${msgMinute}`}
            </div>
        </div>
        {displayDeletebtn && <div className='delete' onClick={deleteMsg}>X</div>}
    </div>
  )
}

