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

/* ---------------------------------------------------------- */

export default function Register() {
    let navigate = useNavigate();

    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");

    const [user, setUser] = useState({})

    const auth = getAuth();

    /*
    If the user is already logged in and navigates to this page, redirect to Dashboard
    */
    onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
        navigate('/Dashboard', {state: {email: registerEmail}});
        const uid = currentUser.uid;
    }
    });

    /*
    Creates a user and logs in automatically
    */
    const register = async () => {
        if (registerEmail == "" || registerPassword == "") {
            alert("Please do not leave any inputs blank")
        }
        try {
            const user = await createUserWithEmailAndPassword(
                auth,
                registerEmail,
                registerPassword
            );
            console.log(user);
            navigate('/Dashboard');
        } 
        catch (error) {
            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode == 'auth/invalid-email') {
                alert("The email address is invalid");
            }
            else if (errorCode == 'auth/email-already-in-use') {
                alert("This email is already in use");
            }
            else if (errorCode == 'auth/weak-password') {
                alert ("The password must have at least six characters");
            }
            else {
                alert(errorCode);
            }
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
