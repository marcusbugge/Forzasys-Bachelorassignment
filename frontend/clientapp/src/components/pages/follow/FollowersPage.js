import axios from "axios";
import React, { useEffect, useState } from "react";
import "./followers.css";
import { useNavigate } from "react-router-dom";

export default function FollowersPage() {
  const [followers, setFollowers] = useState([]);
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  let navigate = useNavigate();

  let url = "http://localhost:5000/api/followers/" + loggedUser.id;

  useEffect(() => {
    if (followers.length == 0) {
      requestAPI(url);
    }
    else{
      console.log("followers ", followers)
    }
  }, [followers]);

  function requestAPI(url) {
    axios.get(url).then((response) => {
      setFollowers(response.data);
    });
  }

  function profilePageLoad(e) {
    navigate("/profil/" + e);
  }

  return (
    <div className="follow-page">
      <div className="header-followpage-cnt">
        <h1>Your friends</h1>
        <p>
          Her kan du se dine venners aktivitet, og hvordan de gjør det i
          fan-ligaen!
        </p>
        <div className="stroke"></div>
      </div>

      <div className="follow-holder">
        {followers.map((obj, index) => (
          <div className="follow-cnt" onClick={() => profilePageLoad(obj.name)}>
            <div className="profilepic">
              <img
                src={require("../../../assets/profilepic/" + obj.profile_pic)}
                alt="profilepicture"
              />
            </div>
            <div className="div-name">
              {" "}
              <h1 className="name-head">{obj.name}</h1>
            </div>

            <div className="stroke-follow"></div>

            <div className="follow-data">
              <div className="ranking">
                <p>Overall rank</p>
                <p className="score-follow">{obj.overall_rank}.</p>
              </div>
              <div className="clubrank">
                <p>Clubrank</p>
                <p className="score-follow">{obj.club_rank}.</p>
              </div>
              <div className="totalpoints">
                <p>Total points</p>
                <p className="score-follow">{obj.total_points}</p>
              </div>
            </div>

            <div className="club-follow">
              <img
                src={require("../../../assets/teamLogos/" +
                  obj.club_logo)}
                alt={obj.club_name}
              />
              <p>{obj.club_name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
