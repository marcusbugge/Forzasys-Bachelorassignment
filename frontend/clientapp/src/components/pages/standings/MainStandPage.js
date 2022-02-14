import React from "react";
import "./standings.css";
import usericon from "../../../assets/icons/usericon.png";

export default function MainStandPage() {
  const userstats = [
    {
      name: "navn1",

      club: "club1",
      points: 100,
      posted_videos: 1,
    },
    {
      name: "navn2",
      club: "club2",
      points: 200,
      posted_videos: 2,
    },
    {
      name: "navn3",
      club: "club3",
      points: 300,
      posted_videos: 3,
    },

    {
      name: "navn4",
      club: "club4",
      points: 400,
      posted_videos: 4,
    },
    {
      name: "navn1",
      club: "club1",
      points: 100,
      posted_videos: 1,
    },
    {
      name: "navn2",
      club: "club2",
      points: 200,
      posted_videos: 2,
    },
    {
      name: "navn3",
      club: "club3",
      points: 300,
      posted_videos: 3,
    },

    {
      name: "navn4",
      club: "club4",
      points: 400,
      posted_videos: 4,
    },
    {
      name: "navn1",
      club: "club1",
      points: 100,
      posted_videos: 1,
    },
    {
      name: "navn2",
      club: "club2",
      points: 200,
      posted_videos: 2,
    },
  ];

  const User = () => {
    return (
      <div className="profiledata">
        <div className="picture-icon-cnt">
          <img src={usericon} alt="profilepicture" />
        </div>
        <h1>Navn Navnesen</h1>
      </div>
    );
  };

  return (
    <div>
      <div className="standings-header">
        <h1>Scoreboard</h1>
      </div>

      <div className="tables">
        <div className="filtering">
          <h1>Sort by</h1>
          <div>
            <button>Sweden</button>
            <button>Sw</button>
            <button>Your club</button>
          </div>
        </div>
        <div className="table-header">
          <div className="rank">Rank</div>
          <div className="name">Name</div>
          <div className="club">Club</div>
          <div className="points">Points</div>
        </div>
        <div className="table-content">
          {userstats.map((post, index) => (
            <div className="table-element" key={index}>
              <p>{post.club}</p>
              <p>{post.name}</p>
              <p>{post.points}</p>
              <p>{post.posted_videos}</p>
            </div>
          ))}
        </div>
        <div className="step-buttons">
          <button className="prev-btn">Prev</button>
          <button className="next-btn">Next</button>
        </div>
      </div>
    </div>
  );
}
