import { useState } from "react";
import { 
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Link 
} from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import Dashboard from "./Dashboard"
import Register from "./Register"

function Login() {
    
    let navigate = useNavigate();

    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({})

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    })

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

    const login = async () => {
        try {
        // creates a user and logs in automatically
        console.log("hello");
        const user = await signInWithEmailAndPassword(
            auth,
            loginEmail,
            loginPassword
        );
        console.log(user);
        navigate('/Dashboard');
        } 
        catch (error) {
        console.log(error.message);
        }
    }

    const logout = async () => {
        await signOut(auth);
    }
            
    return (
        <div className="Login">
        <div>
            <h3>Register</h3>
            <input placeholder="Email" 
            onChange={(event) => {
            setRegisterEmail(event.target.value);
            }}
            />
            <input placeholder="Password" 
            onChange={(event) => {
            setRegisterPassword(event.target.value);
            }}
            />
            <button onClick={register}>Create User</button>
        </div>

        <div>
            <h3>Login</h3>
            <input placeholder="Email" 
            onChange={(event) => {
            setLoginEmail(event.target.value);
            }}
            />
            <input placeholder="Password" 
            onChange={(event) => {
            setLoginPassword(event.target.value);
            }}
            />
            <button onClick={login}>Login</button>
        </div>

        <div>
            <h3>User Logged In:{user?.email}</h3>
            <button onClick={logout}>Sign Out</button>
        </div>

        </div>
    );
}

export default Login;
