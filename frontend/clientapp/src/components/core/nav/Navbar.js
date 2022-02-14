import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import Welcome from "../../pages/welcome/Welcome";

export default function Navbar() {
  return (
    <div className="nav">
      <div className="nav-header"></div>

      <div className="links-cnt">
        <h1>PROFIL</h1>
        <div className="links">
          <Link to="/profil">Profil</Link>
          <Link to="/login">Login</Link>
        </div>
        <div className="a"></div>
      </div>
    </div>
  );
}
