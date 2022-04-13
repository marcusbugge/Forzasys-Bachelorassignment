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
  const usertest = "";

  const showBadge = (index) => {
    setHoveredBadge(index);
    setDisplay("badge-info-cnt-displayed");
  };
  let navigate = useNavigate();

  const loggedUser = JSON.parse(localStorage.getItem("user"));

  let loggedUsername = " ";
  if (JSON.parse(localStorage.getItem("user"))) {
    loggedUsername = loggedUser.username;
  }

  const { username } = useParams();

  console.log("test", { username });

  const hideBadge = () => {
    setHoveredBadge(-1);
    setDisplay("badge-info-cnt-notdisplayed");
  };

  async function getUser() {
    await axios
      .get("http://localhost:5000/api/user/" + username)
      .then((response) => {
        setUser(response.data);
        setLoading(true);
        getBadges(response.data.id);
        console.log(response.data);
      });
  }

  useEffect(() => {
    getUser();
  }, []);

  async function getBadges(e) {
    const henticon = await axios.get(
      "http://localhost:5000/api/badges/user/" + e
    );
    const data = henticon.data;
    setBadges(data);
  }

  const userprofileLoad = async () => {
    navigate("/editprofil");
  };

  return (
    <div className="profile-cnt">
      {loading ? (
        <div>
          <div className="profiledata">
            <div className="profile-header">
              <div className="picture-icon-cnt">
                <img
                  src={require("../../../assets/profilepic/" +
                    user.profile_pic)}
                  alt="profilepicture"
                />
              </div>
            </div>
            {loggedUsername === username ? (
              <button
                className="profile-edit-menu-btn"
                onClick={userprofileLoad}
              >
                <IconContext.Provider value={{ size: "30px" }}>
                  <div className="profile-edit-cnt">
                    <BiCog />
                  </div>
                </IconContext.Provider>
              </button>
            ) : (
              ""
            )}
            <div className="profile-edit-name">
              <h1>{user.name}</h1>
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
                        src={require("../../../assets/badgeIcons/" +
                          icon.picture)}
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
                            <p>Beskrivelse: {icon.description}</p>
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
                  <p>{user.club_name}</p>
                  <img
                    alt={user.club_logo}
                    src={require("../../../assets/teamLogos/" + user.club_logo)}
                  />
                </div>
                <div className="profile-club-cnt-points">
                  <h2>Dine poeng:</h2>
                  <p>{user.total_points}</p>
                </div>
              </div>
              <div className="profile-points-cnt">
                <h1>Klubb-rang:</h1>
                <p>{user.club_rank}</p>
              </div>
            </div>
            <div className="most-popularclips-cnt">
              <div className="stroke-blue"></div>
              <div className="posts"></div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
