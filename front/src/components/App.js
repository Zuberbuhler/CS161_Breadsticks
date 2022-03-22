import {   
  useNavigate,
  Link  
} from "react-router-dom";

import {
  onAuthStateChanged,
  getAuth,
} from "firebase/auth";

import "./css/App.css"

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

  const login = () => {
    navigate('/Login');
  }

  const register = () => {
    navigate('/Register');
  }

  const gameClient = () => {
    navigate('/GameClient');
  }

  return (
    <div>
      <h1>Breadsticks</h1>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem"
        }}
      >
        <button class="button-5" onClick={login}>Login</button>
        <button class="button-5" onClick={register}>Register</button>
        <button class="button-5" onClick={gameClient}>Game Demo</button>
      </nav>
    </div>
  );
}