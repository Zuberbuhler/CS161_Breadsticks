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
import Dashboard from "./Dashboard";
import Login from "./Login";

export default function Register() {
    let navigate = useNavigate();

    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const [user, setUser] = useState({})

    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
        navigate('/Dashboard');
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
        <br /> 
        <div>
            Already have an account?
            <Link to="/Login"> Login</Link>
        </div>

        </div>
    );
}
