import axios from "axios";
import React, { useEffect, useState } from "react";
import Video from "../../parts/Video";
import Alerts from "../../parts/Alerts";
import "./likedvideos.css";

export default function LikedVideos() {
  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    axios
      .get("/api/user/like_video/" + localStorage.getItem)
      .then((response) => {
        setVideoData(response.data.playlists);

        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div className="follow-page">
      <div className="header-followpage-cnt">
        <h1>Liked videos</h1>
        <p>Her kan du se hvilke highlights du har likt!</p>
      </div>
      <div className="stroke-video"></div>
      <div className="video-feed">
        {videoData.map((obj, index) => (
          <Video obj={obj} />
        ))}
      </div>
    </div>
  );
}
