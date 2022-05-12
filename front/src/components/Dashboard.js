import { useState } from "react";
import { 
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Link, 
  Navigate
} from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth,
  signOut,
} from "firebase/auth";

/* ---------------------------------------------------------- */

export default function Dashboard() {
    let navigate = useNavigate();

    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const [user, setUser] = useState({})
    const [guestEmail, setGuestEmail] = useState("");

    const auth = getAuth();

    console.log(user?.email);
    if (user?.email === undefined) {
        // setGuestEmail("guest");
        console.log("no email");
    }
    
    /*
    If the user is NOT already logged in and navigates to this 
    page, redirect to landing page
    
    onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) {
            navigate('/');
        }
        else {
            setUser(currentUser)
        }
    });
    */

    /*
    Logs out and navigates to the landing page
    */
    const logout = async () => {
        await signOut(auth);
        navigate('/');
    }

    /*
    Navigates to the Rooms page
    */
    const rooms = async () => {
        navigate('/Rooms');
    }

    return (
        <body>
            <h1>DASHBOARD</h1>
            {user?.email === undefined ? 
                <h3>Hello, guest</h3>
                :
                <h3>Hello, {user?.email}</h3>
            }
            <button class="button-5" onClick={rooms}>Rooms</button>
            <button class="button-5" onClick={logout}>Log out</button>
        </body>
    )
}
