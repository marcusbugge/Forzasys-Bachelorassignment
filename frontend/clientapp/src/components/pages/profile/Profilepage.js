import React from "react";
import "./profiledata.css";
import usericon from "../../../assets/icons/usericon.png";

export default function Profilepage() {
  return (
    <div>
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
        <div className="badge">6</div>
      </div>
    </div>
  );
}
