import React, { useEffect, useState } from "react";
import "./../standings.css";
import usericon from "../../../../assets/icons/usericon.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loading from "../../../parts/Loading";

export default function MostSupporters() {
  const [filter, setFilter] = useState([0, 9]);
  const [stand, setStand] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  let loggedUser = {
    name: "",
  };

  if (localStorage.getItem("loggedIn")) {
    loggedUser = JSON.parse(localStorage.getItem("user"));
  }

  useEffect(() => {
    sortByClub();
  }, [filter]);

  function sortByClub() {
    requestAPI(url + filter[0] + "/" + filter[1]);
  }

  async function nextAndPrevPage(lower, upper) {
    setFilter([lower, upper]);
  }

  let url = "http://localhost:5000/api/most_supporters/";
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

  return (
    <div className="club-sort">
      <div className="club-rank">
        <h1>Flest Supportere</h1>
      </div>
      <div className="table-header">
        <div className="name">Klubb</div>
        <div className="club">Supportere</div>
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
                  loggedUser.club_id === post.id
                    ? "table-element-active"
                    : "table-element"
                }
                key={index}
              >
                <div className="img-club">
                  <img
                    src={require("../../../../assets/teamLogos/" +
                      post.club_logo)}
                    alt="logo"
                  />
                  <p>{post.club_name}</p>
                </div>
                <p className="supporters">{post.supporter_count}</p>
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
                Forrige
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
              Neste
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
