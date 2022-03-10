import React, { useState } from "react";
import axios from "axios";
import "./login.css";
import { Link } from "react-router-dom";
import Loginconfirmation from "./LoginConfirmation";
import { useNavigate } from "react-router-dom";

export default function Login() {
  let navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
  };

  let username;
  let password;

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
      .post("http://localhost:5000/api/login", user)
      .then((response) => {
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("user", JSON.stringify(response.data));
        window.location.reload();
        navigate("/");
      })
      .catch((e) => console.log("something went wrong :(", e));
  }

  return (
    <div className="login-page">
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
