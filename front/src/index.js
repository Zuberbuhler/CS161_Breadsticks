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

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="Login" element={<Login />} />
      <Route path="Dashboard" element={<Dashboard />} />
      <Route path="Register" element={<Register />} />
      <Route path="Rooms" element={<Rooms />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

