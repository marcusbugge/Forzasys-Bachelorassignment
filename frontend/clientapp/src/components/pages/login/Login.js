import React, { useState } from "react";
import axios from "axios";
import "./login.scss";
import { Link } from "react-router-dom";
import Loginconfirmation from "./Alert";
import { useNavigate } from "react-router-dom";

export default function Login() {
  let navigate = useNavigate();
  const [hidden, setHidden] = useState(true);

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

    await axios
      .post("http://localhost:5000/api/login", user)
      .then((response) => {
        localStorage.setItem("loggedIn", true);
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/");
        window.location.reload(true);
      })
      .catch((e) => {
        console.log("something went wrong :(", e);
        setHidden(false);
      });
  }

  function exitLogin() {
    navigate("/");
  }

  return (
    <div className="login-page">
      <div onClick={() => exitLogin()} className="exit-btn">
        <div className="exit-tag">x</div>
      </div>
      <div className="login-cnt">
        <div className="login-part1">
          <div className="part1-content">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/0/03/Allsvenskan.svg"
              alt=""
            />
          </div>
          <div className="part1-img">
            <img src={require("../../../assets/images/fans.png")} alt="fans" />
          </div>
        </div>
        <div className="loginform">
          <div className="login-part2">
            <div className="loginheader-cnt">
              <h1>Velkommen tilbake!</h1>
            </div>

            <form onSubmit={handleLogin}>
              <div className="label-cnt">
                <div className="input">
                  <input className="input-field" name="email" type="text" />
                  <label className="input-label">Epost</label>
                </div>
                <div className="input">
                  <input
                    className="input-field"
                    name="password"
                    type="password"
                  />
                  <label className="input-label">Passord</label>
                </div>

                {hidden ? (
                  <div>""</div>
                ) : (
                  <div className="failed-login">Feil epost eller passord</div>
                )}

                <div className="signup-link">
                  <Link to="/signup">
                    Har ikke registrert bruker enda? Registrer deg her!
                  </Link>
                </div>
              </div>

              <div>
                {localStorage.getItem("loggedIn") ? (
                  <button onClick={logout} className="login-btn">
                    <p>Logg ut</p>
                  </button>
                ) : (
                  <button className="login-btn" type="submit">
                    <p>Logg inn</p>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
