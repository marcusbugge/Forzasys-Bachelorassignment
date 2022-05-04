import axios from "axios";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./createuser.css";
import SelectTeam from "./SelectTeam";
import soccerfan from "../../../assets/images/soccer-fan.jpg";
import Alerts from "../../parts/Alerts";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
  let navigate = useNavigate();
  const [team, setTeam] = useState("");

  const [errorPassword, setErrorPassword] = useState(true);
  const [render, setRender] = useState(false);

  async function signup(e) {
    e.preventDefault();

    if (
      e.target.password.value !== "" &&
      e.target.password.value === e.target.cpassword.value
    ) {
      setErrorPassword(true);
      const userdata = {
        password: e.target.password.value,
        given_name: e.target.fname.value,
        family_name: e.target.lname.value,
        age: e.target.age.value,
        email: e.target.email.value,
        club_id: team,
        role: "user",
        username: e.target.username.value,
      };
      console.log(userdata);

      let url = "http://localhost:5000/api/user";

      const headers = { "header-name": "value" };
      const config = { headers };

      await axios
        .post(url, userdata, config)
        .then(() => {
          setRender(true);
          handleLogin(userdata.email, userdata.password);
        })
        .catch((e) => console.log("something went wrong :(", e));
    } else {
      setErrorPassword(false);
    }
  }

  async function handleLogin(username, password) {
    const user = {
      email: username,
      password: password,
    };

    axios
      .post("http://localhost:5000/api/login", user)
      .then((response) => {
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("user", JSON.stringify(response.data));
        setTimeout(() => {}, 100);
        navigate("/");
      })
      .catch((e) => {
        console.log("something went wrong :(", e);
      });
  }

  return (
    <div>
      <div className="signup">
        {render ? <Alerts message="Bruker opprettet!" /> : ""}
        <div className="imgholder-fan">
          <img src={soccerfan} alt="soccerfan" />
        </div>

        <div className="signup-cnt">
          <div className="signup-content">
            <div className="signup-form">
              <div className="signup-header-cnt">
                <h1 className="form-title">Lag bruker</h1>
              </div>

              <form
                onSubmit={signup}
                className="register-form"
                id="register-form"
              >
                <div className="form-group">
                  <label htmlFor="name"></label>
                  <p>Brukernavn</p>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="off"
                    required="true"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name"></label>
                  <p>Fornavn</p>
                  <input
                    type="text"
                    name="fname"
                    id="fname"
                    autoComplete="off"
                    required="true"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="name"></label>
                  <p>Etternavn</p>
                  <input
                    type="text"
                    name="lname"
                    id="lname"
                    autoComplete="off"
                    required="true"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email"></label>
                  <p>Epost</p>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    autoComplete="off"
                    required="true"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="age"></label>
                  <p>Alder</p>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    autoComplete="off"
                    required="true"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password"></label>
                  <p>Passord</p>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="off"
                    required="true"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cpassword"></label>
                  <p>Gjenta passord</p>
                  <input
                    type="password"
                    name="cpassword"
                    id="cpassword"
                    autoComplete="off"
                    required="true"
                  />
                  <h5 className="error" hidden={errorPassword}>
                    Passordene stemmer ikke overens
                  </h5>
                </div>

                <div className="testest">
                  <SelectTeam setTeam={setTeam} team={team} />
                </div>

                <div className="form-button">
                  <button type="submit" className="login-btn">
                    Register
                  </button>
                  <NavLink to="/login" className="signup-image-link">
                    Har allerede laget bruker? Trykk her!
                  </NavLink>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
