import { FollowLiked } from "./FollowLiked";
import React, { useEffect } from "react";
import "./navbar.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import Welcome from "../../pages/welcome/Welcome";
import { useState } from "react";

import { CgProfile } from "react-icons/cg";
import axios from "axios";
import Login from "../../pages/login/Login";

export default function Navbar() {
  const [refresh, setRefresh] = useState(false);

  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  var loggedUser = "";
  var path = "";
  if (localStorage.getItem("loggedIn")) {
    loggedUser = JSON.parse(localStorage.getItem("user"));
    path = "/" + loggedUser.username;
  }

  function logout(e) {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
    setRefresh(true);
  }

  const [triviaStatus, setTriviaStatus] = useState(false);

  useEffect(() => {
    checkTriviaStatus();
  }, [triviaStatus]);

  async function checkTriviaStatus() {
    try {
      await axios
        .get("http://localhost:5000/api/trivia/data/" + loggedUser.id)
        .then((response) => {
          if (response.status === 200) {
            setTriviaStatus(true);
          }
        });
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <div className="nav">
      <div className="nav-header"></div>
      {localStorage.getItem("loggedIn") ? (
        <div className="welcome-nav">
          {" "}
          <h1>{loggedUser.name}</h1>
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
        {localStorage.getItem("loggedIn") ? (
          <div>
            <FollowLiked />
            <h1>LEADERBOARD</h1>
            <div className="links">
              <div className="rank-nav-cnt-">
                <Link to="/">Allsvenskan</Link>
                <div className="currentrank">#{loggedUser.overall_rank}</div>
              </div>

              <div className="rank-nav-cnt-">
                <Link to="/">{loggedUser.club_name}</Link>
                <div className="currentrank">#{loggedUser.club_rank}</div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <h1>COMPETITIONS</h1>
        <div className="links">
          <div
            className={
              splitLocation[1] === "weeklytrivia" ? "active" : "rank-nav-cnt"
            }
          >
            <div className="trivia-cnt-nav">
              <NavLink to="/weeklytrivia">Weekly trivia</NavLink>
              {triviaStatus ? (
                <div className="circle-nav-trivia-ok"></div>
              ) : (
                <div className="circle-nav-trivia"></div>
              )}
            </div>
          </div>
          <div
            className={
              splitLocation[1] === "mostpopularvideo"
                ? "active"
                : "rank-nav-cnt"
            }
          >
            <NavLink to="/mostpopularvideo">Most popular video</NavLink>
          </div>

          <div
            className={
              splitLocation[1] === "mostpopularclubsong"
                ? "active"
                : "rank-nav-cnt"
            }
          >
            <NavLink to="/mostpopularclubsong">Most popular clubsong</NavLink>
          </div>
        </div>

        {localStorage.getItem("loggedIn") ? (
          <div>
            <h1>PROFIL</h1>
            <div className="links">
              <div className="rank-nav-cnt">
                <NavLink to={path}>Profil</NavLink>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
