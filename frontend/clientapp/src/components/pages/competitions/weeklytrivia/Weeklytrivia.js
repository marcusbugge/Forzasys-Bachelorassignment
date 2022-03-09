import React, { useEffect, useState } from "react";
import "./weeklytrivia.css";
import Quiz from "./Quiz";
import Countdown from "./countdown/Countdown";

export default function Weeklytrivia() {
  localStorage.setItem("sendtInn", false)

  const [bool, setBool] = useState(localStorage.getItem("sendtInn"));

  useEffect(() => {
    
    setBool(localStorage.getItem("sendtInn"))
    console.log(localStorage.getItem("sendtInn"))
    console.log(bool)
  }, [bool])

  return (
    <div className="quizpage">
      <div className="header">
        <h1>Weekly Trivia</h1>
      </div>

      {localStorage.getItem("sendtInn") ?  <Countdown /> : <Quiz />}
    </div>
  );
}
