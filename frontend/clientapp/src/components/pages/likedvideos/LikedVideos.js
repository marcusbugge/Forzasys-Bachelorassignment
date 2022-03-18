import React from "react";
import Video from "../../parts/Video";
import "./likedvideos.css";

export default function LikedVideos() {
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

  return (
    <div className="follow-page">
      <div className="header-followpage-cnt">
        <h1>Liked videos</h1>
        <p>Her kan du se hvilke highlights du har likt!</p>
      </div>
      <div className="stroke-video"></div>
      <div className="video-feed">
        {array.map((obj, index) => (
          <Video obj={obj} />
        ))}
      </div>
    </div>
  );
}
