import axios from "axios";
import React from "react";

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



  function shareButton(actiontype, post){

    const action = {
      user: post.owner,
      actiontype: actiontype,
      video: post.url
    }

    console.log(action)
    console.log(post);

    let url = '/api/actions';

    axios.post(url,action)
    .then(response => {
      console.log(response)});
  }
  

  return (
    <div className="feed">
      <div className="">
        <h1>Video upload</h1>
        <VideoInput />
      </div>
      {posts.map((post, index) => (
        <div key={index}>
          <div className="feed-element">
            <h1>Posted by: {post.owner}</h1>
            <p>{post.url}</p>

            <div className="buttons">
              <button onClick={() => shareButton("share")}>Share</button>
              <button onClick={() => shareButton("like")}>Like</button>
              <button onClick={() => shareButton("play", post)}>Play video</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
