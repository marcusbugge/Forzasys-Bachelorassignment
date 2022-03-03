import React, { useEffect, useState } from "react";
import "./profiledata.css";
import usericon from "../../../assets/icons/usericon.png";
import FeedPosts from "../feed/FeedPosts";
import axios from "axios";

export default function Profilepage() {
  const [user, setUser] = useState();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState();

  async function getUsers() {
    const test = await axios.get("http://localhost:5000/api/user");
    console.log("Req: ", test);
    const data = test.data;
    setUser(data);
    console.log("State: ", user);
  }

  const [video, setVideo] = useState(null);

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
    <div className="profile-cnt">
      <div className="profiledata">
        <div className="picture-icon-cnt">
          <img src={usericon} alt="profilepicture" />
        </div>
        <h1>Navn Navnesen</h1>
      </div>

      <div className="badges-cnt">
        <div className="badge">1</div>
        <div className="badge">2</div>
        <div className="badge">3</div>
        <div className="badge">4</div>
        <div className="badge">5</div>
        <div className="badge">5</div>
      </div>


      <div className="most-popularclips-cnt">
        <div className="stroke-blue"></div>
        <div className="posts">
          {posts.map((post, index) => (
            <div className="post-element" key={index}>
              <h1>Posted by: {post.owner}</h1>
              <p>{post.url}</p>

              <div className="buttons">
                <button>Share</button>
                <button>Like</button>
                <button>Play video</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

