import axios from "axios";
import React, { useEffect, useState } from "react";
import Video from "../../parts/Video";
import Alerts from "../../parts/Alerts";
import "./likedvideos.css";

export default function LikedVideos() {
  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://api.forzasys.com/eliteserien/playlist/?filters=%5B%22official%22%5D&tags=%5B%7B%22action%22:%22goal%22%7D%5D&orderby=date&count=20&from=0"
      )
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
