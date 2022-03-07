import React, { useEffect, useState } from "react";
import "./profiledata.css";
import usericon from "../../../assets/icons/usericon.png";
import FeedPosts from "../feed/FeedPosts";
import axios from "axios";
import HoverImage from "react-hover-image";
  
export default function Profilepage() {
  const [user, setUser] = useState();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState();
  const [display, setDisplay] = useState("badge-info-cnt-notdisplayed");

  const showBadge = e => {
    e.preventDefault();
    setDisplay("badge-info-cnt-displayed");
  }

  const hideBadge = e => {
    e.preventDefault();
    setDisplay("badge-info-cnt-notdisplayed");
  }

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
        </div>
        <h1>Navn Navnesen</h1>
      </div>
      
      <div className="badges-cnt">
      {badges.map((icon) => (
          <div className="badge">
         
            <div className="badge-img-cnt"
                     onMouseEnter={e => {
                      showBadge(e)
                    }}
                    onMouseLeave={e => {
                      hideBadge(e)
                    }}
            >
            
              <img src={icon.picture} alt="" />
              <img src={require("../../../assets/badgeIcons/" +icon.picture)} alt="badgeicon"/>
          
            </div>
            {display && <div className={display}>{icon.name}
              <p>Description: {icon.description}</p>
              <p>Points needed: {icon.points_needed}</p>
              </div>} 
          </div>
            ))}

          
      </div>

      <div className="most-popularclips-cnt">
        <div className="stroke-blue"></div>
        <div className="posts">
        </div>
      </div>
    </div>
  );
}
