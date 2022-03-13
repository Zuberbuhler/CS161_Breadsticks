import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {   
  useNavigate,
  Link  
} from "react-router-dom";
import Messages from './Messages';
import MessageInput from './MessageInput';


// landing page
export default function App() {

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://${window.location.hostname}:3000');
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div>
      <h1>Breadsticks</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem"
        }}
      >
        <Link to="/Login">Login</Link> |{" "}
        <Link to="/Register">Register</Link>
      </nav>
    </div>
  );
}