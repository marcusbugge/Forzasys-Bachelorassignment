import React from "react";

export default function CreateUser() {
  return <div>
    <section className="signup">
        <div className="container mt-5">
          <div className="signup-content">
            <div className="signup-form">
              <h2 className="form-title">Sign up</h2>
              <form className="register-form" id="register-form">
                <div className="form-group">
                  <label htmlFor="name">
                    <i class="xmdi xmdi-account material-icons-name"></i>
                  </label>
                  <input type="text" name="name" id="name" autoComplete="off" placeholder="Your name"></input>
                </div>

              </form>
            </div>
          </div>
        </div>


    </section>

  </div>;
}
