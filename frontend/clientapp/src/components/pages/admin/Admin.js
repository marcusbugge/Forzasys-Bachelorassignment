import React, { useState } from "react";
import BadgeChange from "./adminPages/BadgeChanges";
import ClubChanges from "./adminPages/ClubChanges"
import QuizChanges from "./adminPages/QuizChanges"
import axios from "axios";

export default function Admin() {
  const [clicked, setClicked] = useState("");

  const changeWindow = (e) => {
    setClicked(e);
  };

  const RenderTable = () => {
    if (clicked == "badges") {
      return <BadgeChange />;
    } else if(clicked == "clubs"){
        return <ClubChanges />;
    } else if(clicked == "quizes"){
        return <QuizChanges />
    } else {
      return null;
    }
  };

  return (
    <div className="adminpage">
      <div className="header">
        <h1>Admin side</h1>
      </div>
      <div className="admin-buttons">
        <button onClick={() => changeWindow("clubs")}>Endre på lagene</button>
        <button onClick={() => changeWindow("badges")}>Endre på badges</button>
        <button onClick={() => changeWindow("quizes")}>Lage quiz/ endre quiz-spørsmål</button>
      </div>
      <div className="admin-area">
        <RenderTable />
      </div>
    </div>
  );
}
