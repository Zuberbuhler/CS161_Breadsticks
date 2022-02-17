import './App.css';

function App() {
  return (
    <div className="App">
      <div>
        <h3> Register </h3>
        <input placeholder="Email" />
        <input placeholder="Password" />
        <button> Create User </button>
      </div>

      <div>
        <h3> Login </h3>
        <input placeholder="Email" />
        <input placeholder="Password" />
        <button> Login </button>
      </div>

      <div>
        <h3> User Logged In: </h3>
        <button>Sign Out</button>
      </div>

    </div>
  );
}

export default App;
