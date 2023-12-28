import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useEffect, useState, useContext, createContext } from "react";
import './App.css';
import { SingUp } from './Components/SignUp/SignUp';
import { Login } from './Components/Login/Login';
import { Home } from './Components/Protected/Home';
import axios from "axios";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/signup",
    element: <SingUp/>,
  }
])

export const CurrentUserContext = createContext(null)

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() =>{
    axios.get("http://localhost:5000",{
      withCredentials: true, // Send credentials (cookies)
      headers: {
        'Content-Type': 'application/json',
      //   Authorization: `Bearer ${sessionToken}`, // Include the session token in the Authorization header
      },
    })
    .then((res) => setCurrentUser(res.data))
    .catch(err => console.log(err)) 
  },[])
  
  return (
    <CurrentUserContext.Provider value={{
      currentUser,
      setCurrentUser
    }}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

// Working on textarea row adjustement
// Working on message container
// Working on search conversation 

// Start working on socket io