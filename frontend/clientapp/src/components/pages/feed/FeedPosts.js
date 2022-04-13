import axios from "axios";
import React, { useEffect, useState } from "react";
import "./video.css";
import "./feed.css";

export default function FeedPosts() {
  const [videos, setVideos] = useState([]);

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
    if (videos.length === 0) {
      getVideos();
    } else {
      console.log(videos);
    }
  }, [videos]);

  async function getVideos() {
    const url =
      "https://api.forzasys.com/eliteserien/playlist/?filters=[%22official%22]&tags=[{%22action%22:%22goal%22}]&orderby=date&count=6&from=0";
    await axios.get(url).then((result) => {
      setVideos(result.data);
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

  const VideoPlayer = () => {
    return( videos.map((video) => {
      <video
        id="my-video"
        className="video-js"
        preload="auto"
        controls
        width="640"
        height="264"
        poster={video.thumbnail_url}
        data-setup="{}"
      >
        <source src={video.video_url} type="application/x-mpegURL" />
        <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to
          a web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank">
            supports HTML5 video
          </a>
        </p>
      </video>;
    }))
  };

  return (
    <div className="feed">
      <h1>Video upload</h1>
      <div>
        {videos.length > 0 ? (
          <VideoPlayer />
        ) : (
          <video
            id="my-video"
            className="video-js"
            preload="auto"
            controls
            width="640"
            height="264"
            poster="https://d22hh18o76pkhl.cloudfront.net/mediabank/thumb/eliteserien/4446/05866.jpg"
            data-setup="{}"
          >
            <source
              src="https://api.forzasys.com/eliteserien/playlist.m3u8/4446:5856000:5866000/Manifest.m3u8"
              type="application/x-mpegURL"
            />
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
        )}
      </div>
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
