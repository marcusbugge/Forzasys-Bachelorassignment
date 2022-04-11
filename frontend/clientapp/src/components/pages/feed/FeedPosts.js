import axios from "axios";
import React, { useEffect } from "react";
import "./video.css";

import "./feed.css";
import VideoInput from "./VideoInput";

export default function FeedPosts() {
  const posts = [
    {
      id: 1,
      url: "www/ksdhfjksdhfkdsk.com",
      owner: "owner",
    },
    {
      id: 2,
      url: "www/ksdhfjksdhfkdsk.com",
      owner: "owner1",
    },
    {
      id: 3,
      url: "www/ksdhfjksdhfkdsk.com",
      owner: "owner2",
    },
    {
      id: 4,
      url: "www/ksdhfjksdhfkdsk.com",
      owner: "owner3",
    },
  ];

  function shareButton(actiontype, post) {
    const action = {
      user: post.owner,
      actiontype: actiontype,
      video: post.url,
    };

    console.log(action);
    console.log(post);

    let url = "/api/actions";

    axios.post(url, action).then((response) => {
      console.log(response);
    });
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://vjs.zencdn.net/7.17.0/video.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="feed">
      <div className="VideoUpload">
        <h1>Video upload</h1>
        <VideoInput />
      </div>
      <video
        id="my-video"
        className="video-js"
        preload="auto"
        controls
        width="640"
        height="264"
        poster="https://d22hh18o76pkhl.cloudfront.net/mediabank/thumb/eliteserien/2966/05409.jpg"
        data-setup="{}"
      >
        <source
          src="https://api.forzasys.com/eliteserien/playlist.m3u8/4446:5856000:5866000/Manifest.m3u8"
          type="application/x-mpegURL"
        />
        <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to
          a web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video
          </a>
        </p>
      </video>
    </div>
  );
}
{
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
}
