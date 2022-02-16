import React from "react";
import { NavLink } from "react-router-dom";

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
                  <input type="text" name="name" id="name" autoComplete="off" placeholder="Your name"></input>
                </div>

                <div className="form-group">
                  <label htmlFor="name">
                  </label>
                  <input type="text" name="name" id="name" autoComplete="off" placeholder="Your Name"></input>
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                  </label>
                  <input type="text" name="email" id="email" autoComplete="off" placeholder="Your Email"></input>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                  </label>
                  <input type="text" name="phone" id="phone" autoComplete="off" placeholder="Mobile Number"></input>
                </div>

                <div className="form-group">
                  <label htmlFor="team">
                  </label>
                  <input type="text" name="team" id="team" autoComplete="off" placeholder="Favorite Team"></input>
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                  </label>
                  <input type="password" name="password" id="password" autoComplete="off" placeholder="Password"></input>
                </div>

                <div className="form-group">
                  <label htmlFor="cpassword">
                  </label>
                  <input type="password" name="cpassword" id="cpassword" autoComplete="off" placeholder="Confirm Your Password"></input>
                </div>
                <div className="form-grup form-button">
                  <input type="submit" name="signup" id="signup" className="form-submit" value="register">

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
