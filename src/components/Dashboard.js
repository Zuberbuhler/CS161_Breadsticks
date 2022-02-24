import { useState } from "react";
import { 
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
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
import { auth } from "../firebase";
import Login from "./Login";

export default function Dashboard() {
    let navigate = useNavigate();

    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({})

    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser)
        if (!currentUser) {
            navigate('/');
            const uid = currentUser.uid;
        }
    });

    const register = async () => {
        try {
        // creates a user and logs in automatically
        console.log("hello");
        const user = await createUserWithEmailAndPassword(
            auth,
            registerEmail,
            registerPassword
        );
        console.log(user);
        navigate('/Dashboard');
        } 
        catch (error) {
        console.log(error.message);
        }
    };

    const logout = async () => {
        await signOut(auth);
        navigate('/');
    }

    const rooms = async () => {
        navigate('/Rooms');
    }

    return (
        <div>
            <h1>DASHBOARD</h1>
            <h3>User Logged In:{user?.email}</h3>
            <button onClick={logout}>Log out</button>
            <button onClick={rooms}>Rooms</button>
        </div>
    )
}
