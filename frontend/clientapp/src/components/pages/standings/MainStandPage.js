import React, { useEffect, useState } from "react";
import "./standings.css";
import usericon from "../../../assets/icons/usericon.png";
import axios from "axios";
import Loading from "../../parts/Loading";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function MainStandPage() {
  const [filter, setFilter] = useState([0, 9]);
  const [stand, setStand] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  let loggedUser = {
    club_id : "",
    club_logo : "",
    club_name : "",
    club_rank : "",
    id : "",
    name : "",
    overall_rank : "",
    profile_pic : "",
    total_points : ""
  };

  if (localStorage.getItem("loggedIn")) {
    loggedUser = JSON.parse(localStorage.getItem("user"));
  }
  let navigate = useNavigate();
  let url = "http://localhost:5000/api/leaderboard/";

  useEffect(() => {
    sortByPlayers();
  }, [filter]);

  function requestAPI(url) {
    axios
      .get(url)
      .then((response) => {
        setStand(response.data);
        setLoading(false);
      })
      .catch(() => {
        setDisabled(false);
      });
  }

  const sortByPlayers = async () => {
    requestAPI(url + filter[0] + "/" + filter[1]);
  };

  function sortByClub() {
    requestAPI(url + "sortbyclub/" + filter[0] + "/" + filter[1]);
  }

  const sortByYourClub = async () => {
    requestAPI(url + loggedUser.club_id);
  };

  async function nextAndPrevPage(lower, upper) {
    setFilter([lower, upper]);
  }

  const userprofileLoad = async (e) => {
    navigate("/" + e);
  };

  return (
    <div>
      <div className="header">
        <h1>Standings</h1>
      </div>

      <div className="tables">
        <div className="filtering">
          <h1>Sort by</h1>
          <div className="sort-buttons">
            {localStorage.getItem("loggedIn") ? (
              <button onClick={(e) => sortByYourClub()}>
                {loggedUser.club_name}
              </button>
            ) : null}

            <button onClick={() => sortByPlayers()}>
              Total points by players
            </button>
            <button onClick={() => sortByClub()}>Total points by club</button>
          </div>
        </div>
        <div className="table-header">
          <div className="rank">Rank</div>
          <div className="name">Name</div>
          <div className="club">Club</div>
          <div className="points">Points</div>
        </div>
        {loading ? (
          <div className="loading-standing">
            <Loading className="loading-signup" />
          </div>
        ) : (
          <div>
            <div className="table-content">
              {stand.map((post, index) => (
                <div
                  className={
                    loggedUser.name === post.name
                      ? "table-element-active"
                      : "table-element"
                  }
                  onClick={() => userprofileLoad(post.username)}
                  key={index}
                >
                  <p className="rank-table">{post.rank}</p>
                  <p className="name-table">{post.name}</p>
                  <div className="img-club">
                    <img
                      src={require("../../../assets/teamLogos/" +
                        post.club_logo)}
                      alt="logo"
                    />
                    <p>{post.club}</p>
                  </div>

                  <p className="points-table">{post.points}</p>
                </div>
              ))}
            </div>

            <div className="step-buttons">
              {filter[0] >= 2 ? (
                <button
                  onClick={() => {
                    nextAndPrevPage(filter[0] - 10, filter[1] - 10);
                  }}
                  className="prev-btn"
                >
                  Prev
                </button>
              ) : (
                ""
              )}

              <button
                disabled={disabled}
                onClick={() => {
                  nextAndPrevPage(filter[0] + 10, filter[1] + 10);
                }}
                className="next-btn"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
