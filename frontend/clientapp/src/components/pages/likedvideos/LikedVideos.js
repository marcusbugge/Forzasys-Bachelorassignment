import axios from "axios";
import React, { useEffect, useState } from "react";
import Video from "../../parts/Video";
import Alerts from "../../parts/Alerts";
import "./likedvideos.css";
import { IconContext } from "react-icons/lib";
import { AiFillStar } from "react-icons/ai";

export default function LikedVideos() {
  const [videoData, setVideoData] = useState([]);
  const [newState, setNewState] = useState(false);

  let user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    fetchUserVideos();
  }, [newState]);

  async function fetchUserVideos() {
    await axios
      .get("http://localhost:5000/api/user/liked_videos/" + user.id)
      .then((response) => {
        setVideoData(response.data);

        console.log(response.data);
        script();
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }

  function script() {
    const script = document.createElement("script");
    script.src = "https://vjs.zencdn.net/7.17.0/video.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }

  async function dislikeButton(video) {
    let url = "http://localhost:5000/api/user/dislike_video/" + user.id;
    await axios
      .post(url, video)
      .then((response) => {
        console.log(response);
      })
      .then(() => {
        setNewState(!newState);
      });
  }

  return (
    <div className="follow-page">
      <div className="header-followpage-cnt">
        <h1>Likte høydepunkter</h1>
        <p>Her kan du se hvilke highlights du har likt!</p>
      </div>
      <div className="stroke-video"></div>
      <div className="feed">
        {videoData.map((item, i) => (
          <div key={i} className="video-cont">
            <video
              id="my-video"
              className="video-js"
              preload="auto"
              controls
              width="640"
              height="264"
              poster={item.video_thumbnail}
              data-setup="{}"
            >
              <source src={item.video_url} type="application/x-mpegURL" />
              <p className="vjs-no-js">
                To view this video please enable JavaScript, and consider
                upgrading to a web browser that
                <a
                  href="https://videojs.com/html5-video-support/"
                  target="_blank"
                >
                  supports HTML5 video
                </a>
              </p>
            </video>
            <div className="video-data">
              <div className="header-video">
                <h1>{item.video_description}</h1>
              </div>
              <div
                onClick={() => dislikeButton(item)}
                className="video-actions"
              >
                <IconContext.Provider
                  value={{
                    color: "var(--primary)",
                    size: "30px",
                  }}
                >
                  <div className="star-icon">
                    <AiFillStar />
                  </div>
                </IconContext.Provider>
              </div>
            </div>
            <div className="video-stroke"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
