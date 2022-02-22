import React from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import Welcome from "../../pages/welcome/Welcome";
import { useState } from "react";

import { CgProfile } from "react-icons/cg";

export default function Navbar() {
  const [refresh, setRefresh] = useState(false);

  function logout(e) {
    localStorage.removeItem("loggedIn");
    setRefresh(true);
    console.log("log out??");
  }

  const style = { color: "white" };

  return (
    <div className="nav">
      <div className="nav-header"></div>
      {localStorage.getItem("loggedIn") ? (
        <div className="welcome-nav">
          {" "}
          <h1>{localStorage.getItem("user")} usersen</h1>
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
            <Link to="/goaloftheround">Goal of the round</Link>
          </div>
          <div className="rank-nav-cnt">
            <Link to="/">Most popular video</Link>
          </div>

          <div className="rank-nav-cnt">
            <Link to="/">Most popular clubsong</Link>
          </div>
        </div>
        <h1>PROFIL</h1>
        <div className="links">
          <div className="rank-nav-cnt">
            <Link to="/profil">Profil</Link>
          </div>
          <div className="rank-nav-cnt">
            <Link to="/feed">Feed</Link>
          </div>
        </div>
        <div className="a"></div>
      </div>
    </div>
  );
}
