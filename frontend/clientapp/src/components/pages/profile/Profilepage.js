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
  const [isFollowing, setIsFollowing] = useState();
  const usertest = "";

  const showBadge = (index) => {
    setHoveredBadge(index);
    setDisplay("badge-info-cnt-displayed");
  };
  let navigate = useNavigate();

  let loggedUser = JSON.parse(localStorage.getItem("user"));
  let followList = loggedUser.following;

  let loggedUsername = " ";
  if (JSON.parse(localStorage.getItem("user"))) {
    loggedUsername = loggedUser.username;
  }
  useEffect(() => {
    loggedUser = JSON.parse(localStorage.getItem("user"));
    followList = loggedUser.following;
  }, [isFollowing]);

  const { username } = useParams();

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
      });
  }

  useEffect(() => {
    if (user === undefined) {
      getUser();
    } else followCheck();
  }, [user]);

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

  async function follow() {
    if (isFollowing) {
      const url = "http://localhost:5000/api/user/unfollow/" + user.id;
      const data = {
        user_id: loggedUser.id,
      };

      const headers = { "header-name": "value" };
      const config = { headers };

      await axios
        .post(url, data, config)
        .then((response) => {
          console.log(response.data);
          console.log(response.status);
          setIsFollowing(false);
        })
        .catch((e) => console.log("something went wrong :(", e));
    } else {
      const url = "http://localhost:5000/api/user/follow/" + user.id;
      const data = {
        user_id: loggedUser.id,
      };
      const headers = { "header-name": "value" };
      const config = { headers };

      await axios
        .post(url, data, config)
        .then((response) => {
          console.log(response.data);
          console.log(response.status);
          setIsFollowing(true);
        })
        .catch((e) => console.log("something went wrong :(", e));
    }
  }

  function followCheck() {
    let bool = false;
    if (followList !== undefined && user !== undefined) {
      followList.map((element) => {
        if (element == user.id) {
          bool = true;
        }
      });
    }
    setIsFollowing(bool);
  }

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
            {loggedUsername !== username ? (
              <div
                onClick={() => follow()}
                className={isFollowing ? "unfollow-button" : "follow-button"}
              >
                {isFollowing ? <h3>Følger</h3> : <h3>Følg</h3>}
              </div>
            ) : (
              ""
            )}
            <div className="badges-cnt">
              <div className="badges-cnt-title">
                {loggedUsername == username ? (
                  <h1>Dine Badges</h1>
                ) : (
                  <h1>{user.name}s Badges</h1>
                )}
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
                            <p>{icon.description}</p>
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
