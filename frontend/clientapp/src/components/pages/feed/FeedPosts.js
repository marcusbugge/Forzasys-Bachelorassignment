import React, { useState } from "react";
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
              <button>Share</button>
              <button>Like</button>
              <button>Play video</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
