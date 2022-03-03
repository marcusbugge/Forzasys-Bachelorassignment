import React, { useState } from "react";
import "./weeklytrivia.css";

export default function Weeklytrivia() {
  const [selectedAnswer, setSelectedAnswer] = useState();

  /* hentet liksom fra API */
  const [bool, setBool] = useState(true);

  const questionlist = [
    {
      spørsmål1: "Spørsmål",
      answers: ["henke", "brede", "bugge"],
      correct: "henke",
    },
    {
      spørsmål1: "Spørsmå2",
      answers: ["hengyke", "bredfgfdhde", "budfggge"],
      correct: "bredfgfdhde",
    },
    {
      spørsmål1: "Spørsmå3",
      answers: ["henke", "brdfggdfede", "bugge"],
      correct: "bugge",
    },
    {
      spørsmål1: "Spørsmå4",
      answers: ["henke", "brdfgdgfdfdfgede", "bugge"],
      correct: "henke",
    },
  ];

  function questionHandler(answer, correct) {
    changeStyle();
    if (answer === correct) {
      console.log("correct!");
    } else console.log("wrong");

    console.log(answer);
  }

  const [quizStyle, setQuizStyle] = useState("answers-cnt");

  const changeStyle = () => {
    console.log("you just clicked");

    setQuizStyle("answers-cnt-active");
  };

  return (
    <div className="quizpage">
      <div className="trivia-cnt">
        <div className="triviadata">
          <div className="picture-trivia"></div>
        </div>
      </div>
      <h1>Test tekst</h1>
      {bool ? (
        <div className="quizbox-cnt">
          <div className="quizheader">
            <div className="questionselection">
              {questionlist.map((qObj, index) => (
                <div key={index} className="qustionobj">
                  <h1 className="question">{qObj.spørsmål1}</h1>
                  <div className="answers">
                    {qObj.answers.map((answer, index) => (
                      <div
                        key={index}
                        onClick={() => questionHandler(answer, qObj.correct)}
                        className={quizStyle}
                      >
                        <h2>{answer}</h2>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <h1>Quiz er svart</h1>
      )}
    </div>
  );
}
