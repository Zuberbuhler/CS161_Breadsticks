import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import App from './components/App';
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import Login from "./components/Login";
import Rooms from "./components/Rooms";
import GameClient from "./components/GameClient";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="Login" element={<Login />} />
      <Route path="Dashboard" element={<Dashboard />} />
      <Route path="Register" element={<Register />} />
      <Route path="Rooms" element={<Rooms />} />
      <Route path="GameClient" element={<GameClient />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);