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
        setUser(currentUser)
        navigate('/Dashboard');
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

        <div class="form__group field">
                <input type="input" class="form__field" 
                onChange={(event) => {
                setRegisterEmail(event.target.value);
                }}
                placeholder="username" name="username" id='username' required />
                <label for="username" class="form__label">Username</label>
            </div>

            <div class="form__group field">
                <input type="input" class="form__field" 
                onChange={(event) => {
                setRegisterPassword(event.target.value);
                }}
                placeholder="password" name="password" id='password' required />
                <label for="password" class="form__label">Password</label>
            
            </div>
            <br></br>

            <button class="button-5" onClick={register}>Create User</button>

        <div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
            <p>Already have an account?&nbsp;
            <Link to="/Login">Login</Link></p>
        </div>

        </div>
    );
}
