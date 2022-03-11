import React from "react";
import "./editprofile.css";

export default function Editprofile() {
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <div className="editprofile-header">
        <h1>Editing profile</h1>
      </div>
      <div className="edit-cnt">
        <div className="edit-choice-cnt">
          <h1>Editing profile</h1>
          <div className="separator-cnt">
            <div className="separator-horizontal"></div>
          </div>
          <button className="edit-choice-button">Personlig informasjon</button>
          <div className="separator-cnt">
            <div className="separator-horizontal"></div>
          </div>
          <button className="edit-choice-button">Lorem Ipsum</button>
          <div className="separator-cnt">
            <div className="separator-horizontal"></div>
          </div>
          <button className="edit-choice-button">Lorem Ipsum</button>
          <div className="separator-cnt">
            <div className="separator-horizontal"></div>
          </div>
        </div>

        <div className="separator-cnt">
          <div className="separator-vertical"></div>
        </div>

        <div className="change-inputs-cnt">
          <h2>Navn</h2>
          <input
            type="text"
            className="change-input"
            placeholder={loggedUser.name}
          ></input>

          <h2>Alder</h2>
          <input
            type="text"
            className="change-input"
            placeholder={loggedUser.age}
          ></input>

          <h2>E-mail</h2>
          <input
            type="text"
            className="change-input"
            placeholder={loggedUser.email}
          ></input>
        </div>
      </div>
    </div>
  );
}
