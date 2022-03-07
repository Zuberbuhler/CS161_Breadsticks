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
  getAuth,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import Dashboard from "./Dashboard"
import Register from "./Register"

function Login() {
    let navigate = useNavigate();

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({})
    
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
        navigate('/Dashboard');
        const uid = currentUser.uid;
    }
    });

    const login = async () => {
        try {
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
        navigate('/App');
    }
            
    return (
        <div className="Login">

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
        <br /> 
        <div>
            Don't have an account?
            <Link to="/Register"> Register now</Link>
        </div>

        </div>
    );
}

export default Login;
