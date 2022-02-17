import { Link } from "react-router-dom";

export default function App() {
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