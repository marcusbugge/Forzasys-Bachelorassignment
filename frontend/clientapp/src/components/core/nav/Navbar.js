import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import Welcome from "../../pages/welcome/Welcome";

export default function Navbar() {
  return (
    <div className="nav">
      <div className="nav-header"></div>

      <Link to="/login">
        <button className="loginbtn-nav">Login</button>
      </Link>

      <div className="links-cnt">
        <div className="standings">
          <Link to="/">Standings</Link>
        </div>
        <h1>PROFIL</h1>
        <div className="links">
          <Link to="/profil">Profil</Link>
          <Link to="/feed">Feed</Link>
        </div>
        <div className="a"></div>
      </div>
    </div>
  );
}
