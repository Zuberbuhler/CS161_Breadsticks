import {   
  useNavigate,
  Link  
} from "react-router-dom";

import {
  onAuthStateChanged,
  getAuth,
} from "firebase/auth";

import "./App.css"

/* ---------------------------------------------------------- */

export default function App() {
  let navigate = useNavigate();

  const auth = getAuth();

  onAuthStateChanged(auth, (currentUser) => {
  if (currentUser) {
      navigate('/Dashboard');
      const uid = currentUser.uid;
  }
  });

  return (
    <div>
      <h1>Breadsticks</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem"
        }}
      >
        <p><Link to="/Login">Login</Link></p>
        <p><Link to="/Register">Register</Link></p>
        <p><Link to="/TicTacToeGame">TicTacToe</Link></p>
      </nav>
    </div>
  );
}