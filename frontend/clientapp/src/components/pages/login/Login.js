import React, { useState } from "react";
import axios from "axios";
import "./login.css";

export default function Login() {
  const [user, setUser] = useState();
  let username;
  let password;

  const headers = { "header-name": "value" };
  const config = { headers };

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
      <div className="login-cnt">
        <div className="loginform">
          <h1>LOGIN</h1>
          <form onSubmit={handleLogin}>
            <div className="label-cnt">
              <label>
                <p>Username</p>
                <input className="input" name="email" type="text" />
              </label>
              <label>
                <p>Password</p>
                <input className="input" name="password" type="password" />
              </label>
            </div>

            <div className="buttons">
              <button type="submit">
                <p>Login</p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
