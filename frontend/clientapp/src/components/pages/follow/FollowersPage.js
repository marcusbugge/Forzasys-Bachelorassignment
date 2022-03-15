import axios from "axios";
import React, { useEffect, useState } from "react";
import "./followers.css";

export default function FollowersPage() {
  const [data, setData] = useState([]);
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const array = [
    {
      name: "Kyser Kyser",
      rank: "1",
      club_rank: "1",
      total_points: "1000",
      badges: "4",
      club_name: "AIK",
    },
    {
      name: "Feppe Haha",
      rank: "2",
      club_rank: "1",
      total_points: "100",
      badges: "2",
      club_name: "AIK",
    },
    {
      name: "Brede HBK",
      rank: "3",
      club_rank: "2",
      total_points: "10",
      badges: "1",
      club_name: "Hacken",
    },
    {
      name: "Henke Star Wars",
      rank: "22",
      club_rank: "10",
      badges: "10",
      total_points: "1",
      club_name: "Malmo",
    },
  ];

  useEffect(() => {}, [data]);

  let url = "http://localhost:5000/api/followers/" + loggedUser.id;

  function requestAPI(url) {
    axios.get(url).then((response) => {
      setData(response.data);
      console.log(data);
    });
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
        {array.map((obj, index) => (
          <div className="follow-cnt">
            <div className="picture-icon-cnt">
              <img
                src={require("../../../assets/icons/usericon.png")}
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
                <p>Rank</p>
                <p className="score-follow">{obj.rank}.</p>
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
                  obj.club_name +
                  "-Logo.png")}
                alt={obj.club_name}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
