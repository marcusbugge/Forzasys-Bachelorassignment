import React from "react";
import { NavLink } from "react-router-dom";
import "./createuser.css";

export default function CreateUser() {
  return <div>
    <section className="signup">
        <div className="signup-cnt">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title">Sign up</h2>
              <form className="register-form" id="register-form">
                <div className="form-group">
                  <label htmlFor="name">
                  </label>
                  <p>First Name</p>
                  <input type="text" name="fname" id="fname" autoComplete="off" placeholder=""></input>
                </div>

                <div className="form-group">
                  <label htmlFor="name">
                  </label>
                  <p>Surname</p>
                  <input type="text" name="lname" id="lname" autoComplete="off" placeholder=""></input>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                  </label>
                  <p>Email</p>
                  <input type="text" name="email" id="email" autoComplete="off" placeholder=""></input>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                  </label>
                  <p>Mobile Number</p>
                  <input type="text" name="phone" id="phone" autoComplete="off" placeholder=""></input>
                </div>

                <div className="form-group">
                  <label htmlFor="team">
                  </label>
                  <p>Favorite Team</p>
                  <input type="text" name="team" id="team" autoComplete="off" placeholder=""></input>
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                  </label>
                  <p>Password</p>
                  <input type="password" name="password" id="password" autoComplete="off" placeholder=""></input>
                </div>

                <div className="form-group">
                  <label htmlFor="cpassword">
                  </label>
                  <p>Confirm Your Password</p>
                  <input type="password" name="cpassword" id="cpassword" autoComplete="off" placeholder=""></input>
                </div>
                <div className="form-button">
                  <input type="submit" name="signup" id="signup" className="form-submit" value="Register">

                  </input>
                </div>
              </form>
                <NavLink to="/login" className="signup-image-link">I am already a user</NavLink>
              </div>
            </div>
          </div>
    </section>

  </div>;
}
