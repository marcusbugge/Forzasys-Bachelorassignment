import React, { useEffect, useState } from "react";
import "./editprofile.css";
import axios from "axios";
import { IconContext } from "react-icons";
import { FiInfo } from "react-icons/fi";
import { BsKey } from "react-icons/bs";

export default function Editprofile() {
  const loggedUser = JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uname, setUname] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const [errorPassword, setErrorPassword] = useState(true);

  const [page1, setPage1] = useState(false);
  const [page2, setPage2] = useState(false);
  const [page3, setPage3] = useState(false);
  const [saveButtonPage1, setSaveButtonPage1] = useState(false);
  const [saveButtonPage2, setSaveButtonPage2] = useState(false);
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
    setSaveButtonPage1(true);
    setSaveButtonPage2(false);
  };

  const page2Visible = () => {
    setDisplay1("edit-choice-button");
    setDisplay2("edit-choice-button-displayed");
    setDisplay3("edit-choice-button");
    setPage1(false);
    setPage2(true);
    setPage3(false);
    setSaveButtonPage1(false);
    setSaveButtonPage2(true);
  };

  const page3Visible = () => {
    setDisplay1("edit-choice-button");
    setDisplay2("edit-choice-button");
    setDisplay3("edit-choice-button-displayed");
    setPage1(false);
    setPage2(false);
    setPage3(true);
    setSaveButtonPage1(false);
    setSaveButtonPage2(false);
  };

  async function editUser(e) {
    /*  const test = await axios.put(
      "http://localhost:5000/api/user/" + loggedUser.id,
      putRequestName
    );
    console.log(test); */

    e.preventDefault();

    if (email !== "" || name !== "" || uname !== "") {
      const userdata = {
        name: name,
        uname: uname,
        email: email,
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
  }

  async function editUserPassword(e) {
    /*  const test = await axios.put(
      "http://localhost:5000/api/user/" + loggedUser.id,
      putRequestName
    );
    console.log(test); */

    e.preventDefault();

    if (password !== "" && password === cpassword) {
      const userdata = {
        password: password,
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
  }

  return (
    <div>
      <div className="editprofile-header">
        <h1>Editing profile</h1>
      </div>
      <div className="edit-cnt">
        <div className="edit-choice-cnt">
          {/* <h1>Editing profile</h1> */}
          <div className="separator-horizontal"></div>
          <button className={display1} onClick={() => page1Visible()}>
            <IconContext.Provider value={{ size: "20px" }}>
              <div>
                <FiInfo />
              </div>
            </IconContext.Provider>
            Personlig informasjon
          </button>

          <div className="separator-horizontal"></div>

          <button className={display2} onClick={() => page2Visible()}>
            <IconContext.Provider value={{ size: "20px" }}>
              <div>
                <BsKey />
              </div>
            </IconContext.Provider>
            Passord
          </button>

          <div className="separator-horizontal"></div>

          <button className={display3} onClick={() => page3Visible()}>
            Lorem Ipsum
          </button>

          <div className="separator-horizontal"></div>
        </div>

        <div className="separator-vertical"></div>
        <div className="edit-form-cnt">
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

                  <h2>Brukernavn</h2>
                  <input
                    type="text"
                    className="change-input"
                    id="inputage"
                    onChange={(e) => setUname(e.target.value)}
                    placeholder={loggedUser.username}
                  ></input>

                  <h2>E-mail</h2>
                  <input
                    type="text"
                    className="change-input"
                    id="inputemail"
                    placeholder={loggedUser.email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>
              )}
              <div>
                {saveButtonPage1 && (
                  <button type="submit" className="edit-btn-save">
                    Lagre endringer
                  </button>
                )}
              </div>
            </div>
          </form>
          <form
            onSubmit={editUserPassword}
            className="edit-form"
            id="edit-form"
          >
            <div>
              {page2 && (
                <div className="change-inputs-cnt">
                  <h2>Endre passord</h2>
                  <input
                    type="text"
                    className="change-input"
                    id="inputpassword"
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>

                  <h2>Gjenta passord</h2>
                  <input
                    type="text"
                    className="change-input"
                    id="inputcpassword"
                    onChange={(e) => setCpassword(e.target.value)}
                  ></input>
                </div>
              )}
              <div>
                {saveButtonPage2 && (
                  <button type="submit" className="edit-btn-save">
                    Lagre endringer
                  </button>
                )}
              </div>
            </div>
          </form>
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
        </div>
      </div>
    </div>
  );
}
