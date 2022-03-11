import React, { useEffect, useState } from "react";
import "./profiledata.css";
import usericon from "../../../assets/icons/usericon.png";
import FeedPosts from "../feed/FeedPosts";
import axios from "axios";
import HoverImage from "react-hover-image";
import { BiCog } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import { IconContext } from "react-icons";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

export default function Profilepage() {
  const [user, setUser] = useState();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState();
  const [display, setDisplay] = useState("badge-info-cnt-notdisplayed");
  const [hoveredBadge, setHoveredBadge] = useState(-1);
  let navigate = useNavigate();

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [putRequestName, setPutRequestName] = useState({
    age: 25,
  });

  const { username } = useParams();

  console.log("test", { username });

  const showBadge = (index) => {
    setHoveredBadge(index);
    setDisplay("badge-info-cnt-displayed");
  };

  const hideBadge = () => {
    setHoveredBadge(-1);
    setDisplay("badge-info-cnt-notdisplayed");
  };

  async function editUser() {
    const test = await axios.put(
      "http://localhost:5000/api/user/" + loggedUser.id,
      putRequestName
    );
    console.log(test);
  }

  async function getUsers() {
    const test = await axios.get("http://localhost:5000/api/user");
    console.log("Req: ", test);
    const data = test.data;
    setUser(data);
    console.log("State: ", user);
  }
  useEffect(() => {
    console.log(loggedUser);
    getBadges();
  }, []);

  async function getBadges() {
    const henticon = await axios.get(
      "http://localhost:5000/api/badges/user/" + loggedUser.id
    );
    console.log("Req: ", henticon);
    const data = henticon.data;
    setBadges(data);
    console.log("State: ", badges);
  }

  const userprofileLoad = async () => {
    navigate("/editprofil");
  };

  return (
    <div className="profile-cnt">
      <div className="profiledata">
        <div className="profile-header">
          <div className="picture-icon-cnt">
            <img
              src={require("../../../assets/profilepic/" +
                loggedUser.profile_pic)}
              alt="profilepicture"
            />
          </div>
        </div>

        <button className="profile-edit-menu-btn" onClick={userprofileLoad}>
          <IconContext.Provider value={{ size: "30px" }}>
            <div className="profile-edit-cnt">
              <BiCog />
            </div>
          </IconContext.Provider>
        </button>
        <div className="profile-edit-name">
          {/* <IconContext.Provider value={{ size: "30px" }}>
            <div className="profile-edit-cnt">
              <AiOutlineEdit />
            </div>
          </IconContext.Provider> */}
          <h1>{loggedUser.name}</h1>
        </div>
      </div>

      <div className="badges-cnt">
        <div className="badges-cnt-title">
          <h1>Dine Badges</h1>
        </div>
        <div className="badges-cnt-badges">
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
      </div>
      <div className="profile-info-cnt">
        <div className="profile-club-cnt">
          <div className="profile-club-cnt-club">
            <h1>Klubb</h1>
            <p>{loggedUser.club_name}</p>
            <img
              alt={loggedUser.club_logo}
              src={require("../../../assets/teamLogos/" + loggedUser.club_logo)}
            />
          </div>
          <div className="profile-club-cnt-points">
            <h2>Klubb-rang: </h2>
            <p>{loggedUser.club_rank}</p>
          </div>
        </div>
        <div className="profile-points-cnt">
          <h1>Dine poeng</h1>
          <p>{loggedUser.total_points}</p>
        </div>
      </div>
      <div className="most-popularclips-cnt">
        <div className="stroke-blue"></div>
        <div className="posts"></div>
      </div>
    </div>
  );
}
