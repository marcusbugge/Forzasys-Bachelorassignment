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
    if (answer === correct) {
      console.log("correct!");
    } else console.log("wrong");

    console.log(answer);
  }

  return (
    <div className="quizpage">
      <div className="trivia-cnt">
        <div className="triviadata">
          <div className="picture-trivia"></div>
        </div>
      </div>

      {bool ? (
        <div className="quizbox-cnt">
          <div className="quizheader">
            <div className="questionselection">
              {questionlist.map((qObj) => (
                <div key={qObj.spørsmål1} className="qustionobj">
                  <h1 className="question">{qObj.spørsmål1}</h1>
                  <div className="answers">
                    {qObj.answers.map((answer) => (
                      <div
                        key={answer}
                        onClick={() => questionHandler(answer, qObj.correct)}
                        className="answers-cnt"
                        tabindex="0"
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
