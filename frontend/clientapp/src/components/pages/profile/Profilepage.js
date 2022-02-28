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
  useEffect(() => {
    getBadges();
  }, []);
  async function getBadges(){
    const henticon = await axios.get("http://localhost:5000/api/badges/user/1");
    console.log("Req: ", henticon);
    const data = henticon.data;
    setBadges(data);
    console.log("State: ", badges);
  }

  const [video, setVideo] = useState(null);


  return (
    <div className="profile-cnt">
      <div className="profiledata">
        <div className="picture-icon-cnt">
          <img src={usericon} alt="profilepicture" />
          <img
            src={require("../../../assets/icons/usericon.png")}
            alt="profilepicture"
          />
        </div>
        <h1>Navn Navnesen</h1>
      </div>

      <div className="badges-cnt">
      {badges.map((icon) => (
          <div className="team">
            <div className="team-img-cnt">
              <img src={icon.picture} alt="" />
              <img src={require("../../../assets/badgeIcons/" +icon.picture)} alt="badgeicon"/>
            </div>
            </div>
            
            ))}
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
        </div>
      </div>
    </div>
  );
}
