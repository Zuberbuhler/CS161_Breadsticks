import {   
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Link  
} from "react-router-dom";
import {
  onAuthStateChanged,
  getAuth,
} from "firebase/auth";

// landing page
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
        <Link to="/Login">Login</Link> |{" "}
        <Link to="/Register">Register</Link>
      </nav>
    </div>
  );
}