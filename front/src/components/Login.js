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

import "./css/Login.scss"

/* ---------------------------------------------------------- */

function Login() {
    let navigate = useNavigate();

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({})
    
    const auth = getAuth();

    /*
    If the user is already logged in and navigates to this page, redirect to Dashboard
    */
    onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
        navigate('/Dashboard');
        const uid = currentUser.uid;
    }
    });

    /*
    Logs in with provided email and password
    */
    const login = async () => {
        if (loginEmail == "" || loginPassword == "") {
            alert("Please do not leave any inputs blank")
        }
        else {
            try {
                const user = await signInWithEmailAndPassword(
                    auth,
                    loginEmail,
                    loginPassword
                 );
                 
                console.log(user);
                navigate('/Dashboard');
            } 
            catch (error) {
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode == 'auth/invalid-email' || errorCode == 'auth/wrong-password') {
                    alert('Username or password is incorrect')
                }
                else {
                    alert(errorMessage)
                }
                console.log(error.message);
            }
        }

    }

    /*
    Logs in with the preregistered account "tester@gmail.com"
    */
    const tester_login = async () => {
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                "tester@gmail.com",
                "123456"
             );
             
            console.log(user);
            navigate('/Dashboard');
        } 
        catch (error) {
            console.log(error.message);
        }
    }

        /*
    Logs in with the preregistered account "tester2@gmail.com"
    */
    const tester2_login = async () => {
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                "tester2@gmail.com",
                "123456"
             );
             
            console.log(user);
            navigate('/Dashboard');
        } 
        catch (error) {
            console.log(error.message);
        }
    }

    /*
    Logs the user out and navigates to the landing page
    */
    const logout = async () => {
        await signOut(auth);
        navigate('/App');
    }
            
    return (
        <div className="Login">

            <div class="form__group field">
                <input type="input" class="form__field" 
                onChange={(event) => {
                setLoginEmail(event.target.value);
                }}
                placeholder="username" name="username" id='username' required />
                <label for="username" class="form__label">Username</label>
            </div>

            <div class="form__group field">
                <input type="input" class="form__field" 
                onChange={(event) => {
                setLoginPassword(event.target.value);
                }}
                placeholder="password" name="password" id='password' required />
                <label for="password" class="form__label">Password</label>
            
            </div>

            <br></br>
            <button class="button-5" onClick={login}>Login</button>
            
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div>
                <p>
                Don't have an account?&nbsp;
                <Link to="/Register">Register now</Link>
                </p>
                
            </div>
        </div>
    );
    /*
            <div>
                <button class="button-3" onClick={tester_login}>Login as tester</button>
                <button class="button-3" onClick={tester2_login}>Login as tester2</button>
            </div>
    */
}

export default Login;