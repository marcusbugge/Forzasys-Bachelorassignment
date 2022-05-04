import { FollowLiked } from "./FollowLiked";
import React, { useEffect } from "react";
import "./navbar.css";
import { Link, NavLink, useLocation } from "react-router-dom";
import Welcome from "../../pages/welcome/Welcome";
import { useState } from "react";
import { IconContext } from "react-icons/lib";
import { MdOutlineLeaderboard } from "react-icons/md";
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
            Logg ut
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
            <h1>POENGTAVLE</h1>
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
          <div
            className={
              splitLocation[1] === ""
                ? "active-cnt-elem-active"
                : "active-cnt-elem"
            }
            style={{ marginTop: "2em" }}
          >
            <div>
              <IconContext.Provider
                value={{
                  color: "white",
                  size: "20px",
                }}
              >
                <div className="star-icon">
                  <MdOutlineLeaderboard />
                </div>
              </IconContext.Provider>
            </div>
            <div className="like">
              <Link to="/">Rangering</Link>
            </div>
          </div>
        )}

        <h1>KONKURANSER</h1>
        <div className="links">
          <div
            className={
              splitLocation[1] === "weeklytrivia" ? "active" : "rank-nav-cnt"
            }
          >
            <div className="trivia-cnt-nav">
              <NavLink to="/weeklytrivia">Quiz</NavLink>
              {triviaStatus ? (
                <div className="circle-nav-trivia-ok"></div>
              ) : (
                <div className="circle-nav-trivia"></div>
              )}
            </div>
          </div>
        </div>

        {localStorage.getItem("loggedIn") ? (
          <div>
            <h1>PROFIL</h1>
            <div className="links">
              <div className="rank-nav-cnt">
                <NavLink
                  to={path}
                  onClick={() => {
                    setTimeout(() => {
                      window.location.reload(true);
                    }, 10);
                  }}
                >
                  Profil
                </NavLink>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
