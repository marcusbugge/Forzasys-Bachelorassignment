import axios from "axios";
import React, { useEffect, useState } from "react";
import "./video.css";
import { AiOutlineStar } from "react-icons/ai";
import "./feed.css";
import VideoInput from "./VideoInput";
import { IconContext } from "react-icons/lib";

export default function FeedPosts() {
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  function likeButton(actiontype, post) {
    const video_id = "";

    console.log(video_id);
    console.log(post);
    console.log(loggedUser.id);
    let url = "/api/user/like_video/" + loggedUser.id;

    axios.post(url, video_id).then((response) => {
      console.log(response);
    });
  }

  const [videoData, setVideoData] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://api.forzasys.com/eliteserien/playlist/?filters=%5B%22official%22%5D&tags=%5B%7B%22action%22:%22goal%22%7D%5D&orderby=date&count=20&from=0"
      )
      .then((response) => {
        setVideoData(response.data.playlists);
        script();

        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  function script() {
    const script = document.createElement("script");
    script.src = "https://vjs.zencdn.net/7.17.0/video.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }

  return (
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
            poster={item.hd_thumbnail_url}
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
              <h1>{item.description}</h1>
              <p className="views-count">Visninger: {item.view_count}</p>
            </div>
            <div
              onClick={() => likeButton(item.video_url)}
              className="video-actions"
            >
              <IconContext.Provider
                value={{
                  color: "var(--primary)",
                  size: "30px",
                }}
              >
                <div className="star-icon">
                  <AiOutlineStar />
                </div>
              </IconContext.Provider>
            </div>
          </div>
          <div className="video-stroke"></div>
        </div>
      ))}
    </div>
  );
}

/**  {posts.map((post, index) => (
        <div key={index}>
          <div className="feed-element">
            <h1>Posted by: {post.owner}</h1>
            <p>{post.url}</p>

            <div className="buttons">
              <button onClick={() => shareButton("share")}>Share</button>
              <button onClick={() => shareButton("like")}>Like</button>
              <button onClick={() => shareButton("play", post)}>
                Play video
              </button>
            </div>
          </div>
        </div>
))}*/
