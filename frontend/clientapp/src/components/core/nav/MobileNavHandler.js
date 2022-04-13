import React, { useState } from "react";
import { render } from "react-dom";
import MobileNavbar from "./MobileNavbar";

export default function MobileNav() {
  const [render, setRender] = useState(false);

  function changeNav() {
    setRender(!render);
  }

  return (
    <div className="mobilenav">
      <div className="nav-button">
        <div className="shownav-btn">
          <button onClick={(e) => changeNav()}>sjut mig</button>
        </div>
        {render ? (
          <div className="mobile-nav-cnt">
            <MobileNavbar />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
