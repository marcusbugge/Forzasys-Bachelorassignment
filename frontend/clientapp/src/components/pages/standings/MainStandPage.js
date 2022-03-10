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
  const loggedUser = JSON.parse(localStorage.getItem("user"));

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
    requestAPI(url + "1");
  };

  async function nextAndPrevPage(lower, upper) {
    setFilter([lower, upper]);
  }

  const userprofileLoad = async (e) => {
    navigate("profil/" + e);
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
            <button onClick={(e) => sortByYourClub()}>
              <div className="filterbyclub">
                <img
                  src={require("../../../assets/teamLogos/" +
                    loggedUser.club_logo)}
                  alt=""
                />
                {loggedUser.club_name}
              </div>
            </button>
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
                <div className="table-element" key={index}>
                  <p className="rank-table">{post.rank}</p>
                  <p
                    onClick={() => userprofileLoad(post.name)}
                    className="name-table"
                  >
                    {post.name}
                  </p>
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
