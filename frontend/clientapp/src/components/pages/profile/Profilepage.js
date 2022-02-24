import React, { useState, useEffect } from "react";
import "./profiledata.css";
import usericon from "../../../assets/icons/usericon.png";
import FeedPosts from "../feed/FeedPosts";
import axios from "axios";

export default function Profilepage() {
  const [user, setUser] = useState();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://127.0.0.1:5000/api/user/1"
        );

        setUser(response);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
      getBadges();
    };

    fetchData();
  }, []);

  async function getBadges() {
    const api_request = await axios.get(
      "http://localhost:5000/api/badges/user/1"
    );
    setBadges(api_request.data);
    console.log("Badges", api_request.data);
  }

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

