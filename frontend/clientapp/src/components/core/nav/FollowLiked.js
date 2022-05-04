import React from "react";
import "./navbar.css";
import { IconContext } from "react-icons/lib";
import { RiUserFollowFill } from "react-icons/ri";
import { AiOutlineStar } from "react-icons/ai";
import { BiFootball } from "react-icons/bi";
import { MdLeaderboard, MdOutlineLeaderboard } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export function FollowLiked() {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");

  return (
    <div className="active-cnt">
      <div
        className={
          splitLocation[1] === "highlights"
            ? "active-cnt-elem-active"
            : "active-cnt-elem"
        }
      >
        <div>
          <IconContext.Provider
            value={{
              color: "white",
              size: "20px",
            }}
          >
            <div className="star-icon">
              <BiFootball />
            </div>
          </IconContext.Provider>
        </div>
        <div className="like">
          <Link to="/highlights">Høydepunkter</Link>
        </div>
      </div>
      <div
        className={
          splitLocation[1] === "" ? "active-cnt-elem-active" : "active-cnt-elem"
        }
      >
        <div>
          <IconContext.Provider
            value={{
              color: "white",
              size: "20px",
            }}
          >
            <div className="star-icon">
              <MdOutlineLeaderboard />
            </div>
          </IconContext.Provider>
        </div>
        <div className="like">
          <Link to="/">Rangering</Link>
        </div>
      </div>
      <div
        className={
          splitLocation[1] === "following"
            ? "active-cnt-elem-active"
            : "active-cnt-elem"
        }
      >
        <div>
          <IconContext.Provider
            value={{
              color: "white",
              size: "20px",
            }}
          >
            <div className="star-icon">
              <RiUserFollowFill />
            </div>
          </IconContext.Provider>
        </div>
        <div className="like">
          <Link to="/following">Følgere</Link>
        </div>
      </div>

      <div
        className={
          splitLocation[1] === "likedvideos"
            ? "active-cnt-elem-active"
            : "active-cnt-elem"
        }
      >
        <div>
          <IconContext.Provider
            value={{
              color: "white",
              size: "20px",
            }}
          >
            <div className="star-icon">
              <AiOutlineStar />
            </div>
          </IconContext.Provider>
        </div>
        <div className="like">
          <Link to="/likedvideos">Likte høydepunkter</Link>
        </div>
      </div>
    </div>
  );
}
