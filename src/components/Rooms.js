import { 
    Link 
  } from "react-router-dom";

export default function Rooms() {
    
    const hostRoom = async () => {

    }

    return (
      <div>
        <h1>ROOMS</h1>
        <button onClick={hostRoom}>New Room</button>
        <h4>
            <Link to="/Dashboard">Back to Dashboard</Link>
        </h4>
        
        <h5><Link to="">Test room (this will be loaded from a database)</Link></h5>
        <h5><Link to="">Test room</Link></h5>
        <h5><Link to="">Test room</Link></h5>
        <h5><Link to="">Test room</Link></h5>

      </div>
    );
}