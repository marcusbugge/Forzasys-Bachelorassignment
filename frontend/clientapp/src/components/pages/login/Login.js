import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { Link } from "react-router-dom";
import Loginconfirmation from "./LoginConfirmation";

export default function Login() {
  const [user, setUser] = useState();
  let username;
  let password;

  const headers = { "header-name": "value" };
  const config = { headers };

  async function login(e) {
    if (e.target.email.value === "user" && e.target.password.value === "1234") {
      localStorage.setItem("loggedIn", true);
      localStorage.setItem("user", e.target.email.value);
      console.log("logged in!");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    username = e.target.email.value;
    password = e.target.password.value;

    const user = {
      Username: username,
      Password: password,
    };

    axios
      .post("/api/user/login", user, config)
      .then((response) => {
        console.log(response.status);
        console.log(response.data);
        setUser(response.data);
      })
      .catch((e) => console.log("something went wrong :(", e));
  }

  return (
    <div className="login-page">
      {localStorage.getItem("loggedIn") ? <Loginconfirmation /> : ""}
      <div className="login-cnt">
        <div className="loginform">
          <div className="loginheader-cnt">
            <h1>LOGIN</h1>
          </div>

          <form onSubmit={login}>
            <div className="label-cnt">
              <label>
                <p>Username</p>
                <input className="input" name="email" type="text" />
              </label>
              <label>
                <p>Password</p>
                <input className="input" name="password" type="password" />
              </label>
              <Link to="/signup">Dont have a user? Sign up now!</Link>
            </div>

            <div>
              <button className="login-btn" type="submit">
                <p>Login</p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
