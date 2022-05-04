import React, { useEffect, useState } from "react";
import "./standings.css";
import usericon from "../../../assets/icons/usericon.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PlayerTable from "./leaderboard/PlayerTable";
import TeamTable from "./leaderboard/TeamTable";

export default function MainStandPage() {
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

  let url = "http://localhost:5000/api/leaderboard/";
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

  const sortByYourClub = async () => {
    requestAPI(url + loggedUser.club_id);
  };

  return (
    <div>
      <div className="header">
        <h1>Rangering</h1>
      </div>

      <div className="tables">
        <div className="filtering">
          <h1>Sorter etter</h1>
          <div className="sort-buttons">
            {localStorage.getItem("loggedIn") ? (
              <button onClick={(e) => sortByYourClub()}>
                {loggedUser.club_name}
              </button>
            ) : null}

            <button onClick={() => sortByPlayers()}>
              Spillere
            </button>
          </div>
        </div>

        <PlayerTable
          filter={filter}
          setFilter={setFilter}
          stand={stand}
          setStand={setStand}
          loading={loading}
          setLoading={setLoading}
          disabled={disabled}
          setDisabled={disabled}
          sortByPlayers={sortByPlayers}
          loggedUser={loggedUser}
        />
        <TeamTable />
      </div>
    </div>
  );
}
