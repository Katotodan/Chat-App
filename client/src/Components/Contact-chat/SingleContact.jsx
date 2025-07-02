import React, { useEffect, useState } from 'react'
import { getTime } from '../../lib/utils'

export const SingleContact = ({image, lastMessage, time, contactName, currentUserId, displayMsg }) => {
    
    const handleClick = () => {
        displayMsg({id: currentUserId, username: contactName})
    }   
    
    // Is this user online?
  return (
    <div className="contact-chat flex items-center gap-y-0 gap-x-8 p-2 hover:bg-white hover:cursor-pointer
     justify-between" onClick = {handleClick} key={currentUserId}>
        <div className="flex-1">
            {image ? <img src={image} alt="" 
            className="img flex items-center justify-center w-16 h-16 rounded-[50%]" /> :
            <span className="img bg-slate-300 flex items-center justify-center w-16 h-16 rounded-[50%]">{contactName.slice(0,2).toUpperCase()}</span>
            }
        </div>
        <div className="name-msg flex-[3]">
            <p className="overflow-hidden whitespace-nowrap text-ellipsis">{contactName}</p>
            <p className="overflow-hidden whitespace-nowrap text-ellipsis">{lastMessage}</p>
        </div>
        <div className="time flex-1">
            {time ? getTime(time) : ""}
        </div>
    </div>
  ) 
}

