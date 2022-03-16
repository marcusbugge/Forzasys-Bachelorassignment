import React, { useEffect, useState } from "react";
import "./editprofile.css";
import axios from "axios";

export default function Editprofile() {
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState("");
  //const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [page1, setPage1] = useState(false);
  const [page2, setPage2] = useState(false);
  const [page3, setPage3] = useState(false);
  const [saveButton, setSaveButton] = useState(false);
  const [display1, setDisplay1] = useState("edit-choice-button");
  const [display2, setDisplay2] = useState("edit-choice-button");
  const [display3, setDisplay3] = useState("edit-choice-button");

  const page1Visible = () => {
    setDisplay1("edit-choice-button-displayed");
    setDisplay2("edit-choice-button");
    setDisplay3("edit-choice-button");
    setPage1(true);
    setPage2(false);
    setPage3(false);
    setSaveButton(true);
  };

  const page2Visible = () => {
    setDisplay1("edit-choice-button");
    setDisplay2("edit-choice-button-displayed");
    setDisplay3("edit-choice-button");
    setPage1(false);
    setPage2(true);
    setPage3(false);
    setSaveButton(true);
  };

  const page3Visible = () => {
    setDisplay3("edit-choice-button");
    setDisplay2("edit-choice-button");
    setDisplay3("edit-choice-button-displayed");
    setPage1(false);
    setPage2(false);
    setPage3(true);
    setSaveButton(true);
  };

  async function editUser(e) {
    /*  const test = await axios.put(
      "http://localhost:5000/api/user/" + loggedUser.id,
      putRequestName
    );
    console.log(test); */

    e.preventDefault();

    const userdata = {
      name: name,
      age: age,
      //email: email,
    };
    console.log(userdata);

    let url = "http://localhost:5000/api/user/" + loggedUser.id;

    axios
      .put(url, userdata)
      .then((response) => {
        console.log(response.status);
        console.log(response.data);
      })
      .catch((e) => console.log("something went wrong :(", e));
  }

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
          <button className={display1} onClick={() => page1Visible()}>
            Personlig informasjon
          </button>
          <div className="separator-cnt">
            <div className="separator-horizontal"></div>
          </div>
          <button className={display2} onClick={() => page2Visible()}>
            Lorem Ipsum
          </button>
          <div className="separator-cnt">
            <div className="separator-horizontal"></div>
          </div>
          <button className={display3} onClick={() => page3Visible()}>
            Lorem Ipsum
          </button>
          <div className="separator-cnt">
            <div className="separator-horizontal"></div>
          </div>
        </div>

        <div className="separator-cnt">
          <div className="separator-vertical"></div>
        </div>

        <form onSubmit={editUser} className="edit-form" id="edit-form">
          <div>
            {page1 && (
              <div className="change-inputs-cnt">
                <h2>Navn</h2>
                <input
                  type="text"
                  className="change-input"
                  id="inputname"
                  placeholder={loggedUser.name}
                  onChange={(e) => setName(e.target.value)}
                ></input>

                <h2>Alder</h2>
                <input
                  type="text"
                  className="change-input"
                  id="inputage"
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={loggedUser.age}
                ></input>

                <h2>E-mail</h2>
                <input
                  type="text"
                  className="change-input"
                  id="inputemail"
                  placeholder={loggedUser.email}
                  //onChange={(e) => setEmail(e.target.value)}
                ></input>
              </div>
            )}
          </div>
          <div>
            {page2 && (
              <div className="change-inputs-cnt">
                <h2>Page2</h2>
                <input type="text" className="change-input"></input>

                <h2>Page2</h2>
                <input type="text" className="change-input"></input>

                <h2>Page2</h2>
                <input type="text" className="change-input"></input>
              </div>
            )}
          </div>
          <div>
            {page3 && (
              <div className="change-inputs-cnt">
                <h2>Navn</h2>
                <input
                  type="text"
                  className="change-input"
                  placeholder="Page3"
                ></input>

                <h2>Page 3</h2>
                <input
                  type="text"
                  className="change-input"
                  placeholder="Page3"
                ></input>

                <h2>Page 3</h2>
                <input
                  type="text"
                  className="change-input"
                  placeholder="Page3"
                  //onChange={(e) => setEmail(e.target.value)}
                ></input>
              </div>
            )}
          </div>
          <div>
            {saveButton && (
              <button type="submit" class="edit-btn-save">
                Lagre endringer
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
