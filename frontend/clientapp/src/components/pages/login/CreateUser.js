import axios from "axios";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./createuser.css";
import SelectTeam from "./SelectTeam";
import soccerfan from "../../../assets/images/soccer-fan.jpg";

export default function CreateUser() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [team, setTeam] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const [errorPassword, setErrorPassword] = useState(true);

  async function signup(e) {
    e.preventDefault();

    if (password !== "" && password === cpassword) {
      setErrorPassword(true);
      const userdata = {
        password: password,
        given_name: fname,
        family_name: lname,
        age: age,
        email: email,
        club_id: localStorage.getItem("team"),
        role: 'user',
        username: fname + 123
      };
      console.log(userdata);

      let url = "http://localhost:5000/api/user";

      const headers = { "header-name": "value" };
      const config = { headers };

      await axios
        .post(url, userdata, config)
        .then((response) => {
          console.log(response.status);
          console.log(response.data);
        })
        .catch((e) => console.log("something went wrong :(", e));
    } else {
      setErrorPassword(false);
    }
  }

  return (
    <div>
      <div className="signup">
        <div className="imgholder-fan">
          <img src={soccerfan} alt="soccerfan" />
        </div>

        <div className="signup-cnt">
          <div className="signup-content">
            <div className="signup-form">
              <div className="signup-header-cnt">
                <h1 className="form-title">Sign up</h1>
              </div>

              <form
                onSubmit={signup}
                className="register-form"
                id="register-form"
              >
                <div className="form-group">
                  <label htmlFor="name"></label>
                  <p>First Name</p>
                  <input
                    type="text"
                    name="fname"
                    id="fname"
                    onChange={(e) => setFname(e.target.value)}
                    autoComplete="off"
                  ></input>
                </div>

                <div className="form-group">
                  <label htmlFor="name"></label>
                  <p>Surname</p>
                  <input
                    type="text"
                    name="lname"
                    id="lname"
                    autoComplete="off"
                    onChange={(e) => setLname(e.target.value)}
                  ></input>
                </div>

                <div className="form-group">
                  <label htmlFor="email"></label>
                  <p>Email</p>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>

                <div className="form-group">
                  <label htmlFor="age"></label>
                  <p>Age</p>
                  <input
                    type="text"
                    name="age"
                    id="age"
                    autoComplete="off"
                    onChange={(e) => setAge(e.target.value)}
                  ></input>
                </div>

                <div className="form-group">
                  <label htmlFor="password"></label>
                  <p>Password</p>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="off"
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                </div>

                <div className="form-group">
                  <label htmlFor="cpassword"></label>
                  <p>Confirm Your Password</p>
                  <input
                    type="password"
                    name="cpassword"
                    id="cpassword"
                    autoComplete="off"
                    onChange={(e) => setCpassword(e.target.value)}
                  ></input>
                  <h5 className="error" hidden={errorPassword}>
                    Passwords don't match
                  </h5>
                </div>

                <div className="testest">
                  <SelectTeam setTeam={setTeam} />
                </div>

                <div className="form-button">
                  <button type="submit" className="login-btn">
                    Register
                  </button>
                  <NavLink to="/login" className="signup-image-link">
                    Do you already have a account? Click here!
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
