import React,{useEffect,useState, useRef} from 'react'
import axios from 'axios'

export const SearchContact = ({currentUserId, updateContact}) => {
    const [searchUserValue, setSearchUserValue] = useState("")
    const isInitialRender = useRef(true)
    useEffect(()=>{
        const getUser = (uri) =>{
            axios.get(uri,{
                withCredentials: true, // Send credentials (cookies)
                headers: {
                'Content-Type': 'application/json',
                //   Authorization: `Bearer ${sessionToken}`, // Include the session token in the Authorization header
                },
            })
            .then((res) => {
                updateContact(res.data)
            })
            .catch((err) => console.log(err))
        }
        if (isInitialRender.current) {
            // Skip running the effect on the initial render
            isInitialRender.current = false;
          } else {            
            if(searchUserValue){
                getUser(`${process.env.REACT_APP_API_URL}/contact/${searchUserValue}`) 
            }else{
                getUser(`h${process.env.REACT_APP_API_URL}/conversationList/${currentUserId}`)
            }   
        }
    }, [searchUserValue])

    const handleSearch = (e) =>{
        setSearchUserValue(e.target.value)
    }
    

  return (
    <div className="search-form-container w-full sticky top-0 left-0 ">
        <form>
            <input type="text" placeholder="Search by username" 
            value={searchUserValue} onChange={handleSearch} 
            className='h-10 py-1 px-2 text-lg rounded-lg w-full border-solid border-2 border-black'/>
        </form>
    </div>
  )
}

// Working on the search functionality
