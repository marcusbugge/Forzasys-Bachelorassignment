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

  const usertest = localStorage.getItem("user");

  const headers = { "header-name": "value" };

  async function handleLogin(e) {
    e.preventDefault();
    username = e.target.email.value;
    password = e.target.password.value;

    const user = {
      email: username,
      password: password,
    };

    console.log(user);

    axios
      .post("http://127.0.0.1:5000/api/login", user)
      .then((response) => {
        console.log(response.status);
        console.log("test response", response.data);
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("user", JSON.stringify(response.data));
        console.log("henkeBredeUser", localStorage.getItem("user"));
        setUser(response.data);
      })
      .catch((e) => console.log("something went wrong :(", e));
  }

  return (
    <div className="login-page">
      {localStorage.getItem("user") ? <Loginconfirmation /> : ""}
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
