import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./createuser.css";

export default function CreateUser() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [team, setTeam] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  function registrerButton() {
    const userdata = {
      given_name: fname,
      family_name: lname,
      age: age,
      email: email,
      team_id: team,
      password: password,
      cpassword: cpassword,
    };
    console.log(userdata);

    let url = "/api/user";
  }
  return (
    <div>
      <section className="signup">
        <div className="signup-cnt">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title">Sign up</h2>
              <form className="register-form" id="register-form">
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
                  <label htmlFor="team"></label>
                  <p>Favorite Team</p>
                  <input
                    type="text"
                    name="team"
                    id="team"
                    autoComplete="off"
                    onChange={(e) => setTeam(e.target.value)}
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
                </div>
                <div className="form-button">
                  <button onClick={() => registrerButton("userinput")}>
                    Register
                  </button>
                </div>
              </form>
              <NavLink to="/login" className="signup-image-link">
                I am already a user
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
