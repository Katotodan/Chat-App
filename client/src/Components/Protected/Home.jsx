import React, {useContext, useEffect, useRef} from "react";
import { CurrentUserContext } from "../../App";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./Home.css"

import { ContactChat } from "../Contact-chat/Contact";
import { Msg } from "../Msg/Message";


export const Home = () =>{
    useEffect(() =>{

    }, [])
    const {
        currentUser,
        setCurrentUser
      } = useContext(CurrentUserContext)
      const logoutFunc = (e) =>{
          e.preventDefault() 
          axios.post("http://localhost:5000/logout", currentUser
          , {
            withCredentials: true, // Send credentials (cookies)
            headers: {
              'Content-Type': 'application/json',
            //   Authorization: `Bearer ${sessionToken}`, // Include the session token in the Authorization header
            },
        }
        )
        .then((res) => {
            setCurrentUser(null)
        })
        .catch(err => console.log(err)) 

    }
    const contactList = [1,2,34,4,5,1,2,3,4]
    const contact = contactList.map((element, index) =>{
        return <ContactChat/>
    })

    const msgList = [1,2,34,4,5,14]
    const messages = msgList.map((element, index) =>{
        return <Msg/>
    })
    const textArea = useRef(null)

    const adjustRows = () => {
        
        const lines = textArea.current.value.split("\n").length;
        console.log(textArea.current.value)
        textArea.current.rows = lines;
      }

    return(        
        <div>
            {
                currentUser ? (
                    <>
                        <nav>
                            <div>
                                Logo
                            </div>
                            
                            <div className="user">
                                <div>
                                    <p>{currentUser["username"]}</p>
                                    
                                    <span className="userImage"></span>
                                </div>
                                <form onSubmit={logoutFunc}>
                                    <button type="submit">Log out</button>
                                </form>
                            </div>
                        </nav>
                        <main>
                            <div className="contacts">
                                {contact}
                            </div>
                            <div className="message--container">
                                <div className="messages">
                                    {messages}
                                </div>
                                <div className="Search-bar">
                                    <textarea name="" id="" rows="1"  ref={textArea} onChange={adjustRows}></textarea>
                                    <button>Send</button>
                                </div>
                            </div>

                        </main>
                        
                        
                    </>
                
                ) : <Navigate to='/login'/>
            }
        </div>
        
    )
}