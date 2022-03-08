import React, { useEffect } from "react";
import "./navbar.css";
import { Link, NavLink } from "react-router-dom";
import Welcome from "../../pages/welcome/Welcome";
import { useState } from "react";

import { CgProfile } from "react-icons/cg";
import axios from "axios";

export default function Navbar() {
  const [refresh, setRefresh] = useState(false);

  const usertest = JSON.parse(localStorage.getItem("user"));

  function logout(e) {
    localStorage.removeItem("loggedIn");
    setRefresh(true);
    console.log("log out??");
  }

  return (
    <div className="nav">
      <div className="nav-header"></div>
      {localStorage.getItem("loggedIn") ? (
        <div className="welcome-nav">
          {" "}
          <h1>{usertest.name}</h1>
          <button className="logout-btn" onClick={logout}>
            Log out
          </button>
        </div>
      ) : (
        <Link to="/login">
          <button className="loginbtn-nav">Login</button>
        </Link>
      )}
      <div className="links-cnt">
        <h1>LEADERBOARD</h1>
        <div className="links">
          <div className="rank-nav-cnt">
            <Link to="/">Allsvenskan</Link>
            <div className="currentrank">#2</div>
          </div>

          <div className="rank-nav-cnt">
            <Link to="/">Sweden</Link>
            <div className="currentrank">#90</div>
          </div>
        </div>
        <h1>COMPETITIONS</h1>
        <div className="links">
          <div className="rank-nav-cnt">
            <NavLink to="/goaloftheround">Goal of the round</NavLink>
          </div>
          <div className="rank-nav-cnt">
            <NavLink to="/weeklytrivia">Weekly trivia</NavLink>
          </div>
          <div className="rank-nav-cnt">
            <NavLink to="/">Most popular video</NavLink>
          </div>

          <div className="rank-nav-cnt">
            <NavLink to="/">Most popular clubsong</NavLink>
          </div>
        </div>

        <h1>PROFIL</h1>
        <div className="links">
          <div className="rank-nav-cnt">
            <NavLink to="/profil">Profil</NavLink>
          </div>
          <div className="rank-nav-cnt">
            <NavLink to="/feed">Feed</NavLink>
          </div>
        </div>
        <div className="a"></div>
      </div>
    </div>
  );
}
