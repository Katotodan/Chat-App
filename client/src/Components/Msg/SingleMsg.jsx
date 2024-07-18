import axios from 'axios'
import React, {useState, useRef} from 'react'

export const SingleMsg = ({msg, destination}) => {
    const [displayDeletebtn, setDisplayDeletebtn] = useState(false)
    const msgRef = useRef(null)
    const handleMsgClick = ()=>{
        displayDeletebtn ? setDisplayDeletebtn(false) :setDisplayDeletebtn(true)
        
    }
    const deleteMsg = ()=>{
        axios.delete(`http://localhost:5000/deleteMsg/${msg._id}`,
            {
              withCredentials: true, // Send credentials (cookies)
              headers: {
                'Content-Type': 'application/json',
              //   Authorization: `Bearer ${sessionToken}`, // Include the session token in the Authorization header
              },
            }).then((res) => {
                //  Display none the message
                msgRef.current.display = "none"
    
            }).catch(err => console.log(err)
        ) 
    }
  return (
    <div className={msg.receiver == destination ?  "msg-container me" : "msg-container other"}
    ref={msgRef} onClick={handleMsgClick}>
        <div>
            <div className="msg">
                {msg.message}
            </div>
            <div className="time">
                {new Date(msg.time).getHours()}: {new Date(msg.time).getMinutes()}
            </div>
        </div>
        {displayDeletebtn && <div className='delete' onClick={deleteMsg}>X</div>}
    </div>
  )
}

