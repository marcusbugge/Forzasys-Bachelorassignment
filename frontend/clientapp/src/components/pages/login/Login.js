import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { Link } from "react-router-dom";
import Loginconfirmation from "./LoginConfirmation";

export default function Login() {
  const logout = () => {
    localStorage.getItem("loggedIn", false);
  };

  const [user, setUser] = useState();
  let username;
  let password;

  const headers = { "header-name": "value" };
  const config = { headers };

  async function login(e) {
    if (e.target.email.value === "user" && e.target.password.value === "1234") {
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
      .post("http://localhost:5000/api/login", user)
      .then((response) => {
        console.log(user);
        console.log(response.status);
        console.log(response.data);
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("user", e.target.email.value);
        console.log("logged in!");
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

          <form onSubmit={handleLogin}>
            <div className="label-cnt">
              <label>
                <p>Email</p>
                <input className="input" name="email" type="text" />
              </label>
              <label>
                <p>Password</p>
                <input className="input" name="password" type="password" />
              </label>
              <Link to="/signup">Dont have a user? Sign up now!</Link>
            </div>

            <div>
              {localStorage.getItem("loggedIn") ? (
                <button onClick={logout} className="login-btn">
                  <p>Sign out</p>
                </button>
              ) : (
                <button className="login-btn" type="submit">
                  <p>Sign in</p>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
