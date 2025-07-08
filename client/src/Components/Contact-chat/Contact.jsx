import {useEffect, useState, useRef} from "react";
import axios from "axios";
import { SingleContact } from "./SingleContact";
import { SearchContact } from "./SearchContact";
import { socket } from "../../socket";
import { getContact } from "../../lib/utils";

export const ContactChat = ({setDestination , setDestinationName, currentUserId})=>{
    const [contacts, setContact] = useState([])
    const menuContainer = useRef(null)
    const [isMenuIcon, setIsMenuIcon]  = useState(true)

    useEffect( () => {
        const conversations = async() =>{
            const contacts = await getContact(currentUserId)
            setContact([...contacts])
        }
        conversations()
        
        socket.on('sendSpecificMsg', conversations);
        return () => {
            socket.off('sendSpecificMsg', conversations);
        };
    }, []) 
    
    const displayMenu = (e)=>{ isMenuIcon ? setIsMenuIcon(false) : setIsMenuIcon(true)}
    const displayMsg = (element) =>{
        setDestination(element.id)
        setDestinationName(element.username)
        // Removing the menu in table view point
        displayMenu()
        
    }
    const updateContact =(e)=>{
        setContact([...e])
    }

    const contact = contacts.map((el, index) =>{
        return <SingleContact image = {el.image} lastMessage={el.lastMessage} time={el.time} 
        contactName={el.username} key={el._id} currentUserId ={el._id} displayMsg= {displayMsg}/>
    })
    

    return(
        <>
        <div className="h-6 md:hidden absolute top-0 left-2 z-10" onClick={displayMenu} >
                {isMenuIcon ? <span className="text-2xl cursor-pointer">&#8801;</span>: 
                <span className="text-red-600 bg-gray-100 text-2xl  w-full cursor-pointer">&#10006;</span>}
        </div>
        <div className={ `bg-gray-100 pt-8 md:pt-0 w-screen md:w-full h-[calc(100dvh-6.5rem)] md:h-[calc(100dvh-5rem)] 
        overflow-y-auto overflow-x-hidden ${isMenuIcon ? "hidden md:block" : ""}`} ref={menuContainer}>
            <SearchContact updateContact = {updateContact} currentUserId= {currentUserId} />
            {
                contact.length > 0 ? <>{contact}</> :
                <span className="block m-5 text-lg text-center">There were no conversations found!</span> 
            }   
        </div>
        </>
    )
}