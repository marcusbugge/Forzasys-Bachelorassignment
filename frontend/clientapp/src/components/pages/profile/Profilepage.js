import React, { useEffect, useState } from "react";
import "./profiledata.css";
import usericon from "../../../assets/icons/usericon.png";
import FeedPosts from "../feed/FeedPosts";
import axios from "axios";
import HoverImage from "react-hover-image";
import { BiCog } from "react-icons/bi";
import { IconContext } from "react-icons";

export default function Profilepage() {
  const [user, setUser] = useState();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState();
  const [display, setDisplay] = useState("badge-info-cnt-notdisplayed");
  const [hoveredBadge, setHoveredBadge] = useState(-1);

  const showBadge = (index) => {
    setHoveredBadge(index);
    setDisplay("badge-info-cnt-displayed");
  };

  const hideBadge = () => {
    setHoveredBadge(-1);
    setDisplay("badge-info-cnt-notdisplayed");
  };

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
  async function getBadges() {
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
        <IconContext.Provider value={{ size: "30px" }}>
          <div className="profile-edit-cnt">
            <BiCog />
          </div>
        </IconContext.Provider>

        <h1>
          <localStorage.getItem /> Navnesen
        </h1>
      </div>

      <div className="badges-cnt">
        {badges.map((icon, index) => (
          <div key={index} className="badge">
            <div
              className="badge-img-cnt"
              onMouseEnter={() => {
                showBadge(index);
              }}
              onMouseLeave={(e) => {
                hideBadge(e);
              }}
            >
              <img src={icon.picture} alt="" />
              <img
                src={require("../../../assets/badgeIcons/" + icon.picture)}
                alt="badgeicon"
              />
            </div>
            {hoveredBadge === index ? (
              <div key={index} className={display}>
                <div className="badge-title">
                  <h3>{icon.name}</h3>
                </div>
                <div className="badge-desc-cnt">
                  <div className="badge-description">
                    <p>Description: {icon.description}</p>
                  </div>
                  <div className="badge-points">
                    <p>Points needed: {icon.points_needed}</p>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
      <div className="most-popularclips-cnt">
        <div className="stroke-blue"></div>
        <div className="posts"></div>
      </div>
    </div>
  );
}
