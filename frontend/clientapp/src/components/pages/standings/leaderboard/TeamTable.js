import React, { useEffect, useState } from "react";
import "./../standings.css";
import usericon from "../../../../assets/icons/usericon.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "../../../parts/Loading";
import MostSupporters from "./MostSupporters";

export default function TeamTable(props) {
  const [filter, setFilter] = useState([0, 9]);
  const [stand, setStand] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  let loggedUser = {
    name: "",
  };

  let navigate = useNavigate();

  useEffect(() => {
    sortByClub();
  }, [filter]);

  if (localStorage.getItem("loggedIn")) {
    loggedUser = JSON.parse(localStorage.getItem("user"));
  }

  let url = "http://localhost:5000/api/leaderboard/";
  function requestAPI(url) {
    axios
      .get(url)
      .then((response) => {
        setStand(response.data);
        console.log(response.data);
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

  const MainTable = () => {
    return (
      <div className="club-sort">
        <div className="club-rank">
          <h1>Club Ranking</h1>
        </div>
        <div className="table-header">
          <div className="rank">Rank</div>
          <div className="name">Club</div>
          <div className="club">Top Supporter</div>
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
                    loggedUser.club_id === post.club_id
                      ? "table-element-active"
                      : "table-element"
                  }
                  onClick={() => userprofileLoad(post.name)}
                  key={index}
                >
                  <p className="rank-table">{post.club_rank}</p>
                  <div className="img-club">
                    <img
                      src={require("../../../../assets/teamLogos/" +
                        post.club_logo)}
                      alt="logo"
                    />
                    <p>{post.club_name}</p>
                  </div>
                  <p className="name-table">{post.top_supporter_name}</p>
                  <p className="points-table">{post.club_points}</p>
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
    );
  };


  return (
    <div className="team-tables">
      <div className="main-table">
        <MainTable />
      </div>
      <div className="supporter-table">
        <MostSupporters />
      </div>
    </div>
  );
}
