import React from "react";
import { IconContext } from "react-icons/lib";
import { RiUserFollowFill } from "react-icons/ri";
import { AiOutlineStar } from "react-icons/ai";
import { BiFootball } from "react-icons/bi";
import { MdLeaderboard, MdOutlineLeaderboard } from "react-icons/md";

import { Link } from "react-router-dom";
export function FollowLiked() {
  return (
    <div className="active-cnt">
      <div className="active-cnt-elem">
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
          <Link to="/highlights">Highlights</Link>
        </div>
      </div>
      <div className="active-cnt-elem">
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
          <Link to="/">Standings</Link>
        </div>
      </div>
      <div className="active-cnt-elem">
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
          <Link to="/likedvideos">Following</Link>
        </div>
      </div>

      <div className="active-cnt-elem">
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
          <Link to="/likedvideos">Liked videos</Link>
        </div>
      </div>
    </div>
  );
}
