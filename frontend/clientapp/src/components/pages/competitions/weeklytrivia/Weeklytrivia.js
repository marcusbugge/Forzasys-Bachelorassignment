import React, { useState } from "react";
import "./weeklytrivia.css";

export default function Weeklytrivia() {
  const [selectedAnswer, setSelectedAnswer] = useState();

  /* hentet liksom fra API */
  const [bool, setBool] = useState(true);
  const [questions, setQuestions] = useState(5);
  const [answeredQ, setAnsweredQ] = useState(0);

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

  function submitQuiz() {
    console.log("submit");
  }

  return (
    <div className="quizpage">
      <div className="header">
        <h1>Weekly Trivia</h1>
      </div>

      <div className="trivia-info">
        <div className="vertical-stroke"></div>
        <div className="trivia-text">
          <p>
            Answer our weekly trivia to earn points to climb on the ladder!
            Lorem sdfsdfs df sdf sdfsdfsdf
          </p>
        </div>
        <div className="trivia-data">
          <p>Questions: {questions}</p>
          <p>Answered: {answeredQ}</p>
        </div>
      </div>

      <div className="trivia-cnt">
        <div className="triviadata">
          <div className="picture-trivia"></div>
        </div>
      </div>

      {bool ? (
        <div className="quizbox-cnt">
          <div className="quizheader">
            <div className="questionselection">
              {questionlist.map((qObj, index) => (
                <div key={index} className="qustionobj">
                  <h1 className="question"></h1>
                  <p className="question-text">
                    {qObj.spørsmål1} ipsum hahah loool Lorem ipsum hahah loool
                    Lorem ipsum hahah loool ?
                  </p>
                  <div className="answers">
                    {qObj.answers.map((answer, index) => (
                      <div
                        key={index}
                        tabIndex="0"
                        onClick={(e) => questionHandler(answer, qObj.correct)}
                        className="answers-cnt"
                        tabindex="0"
                      >
                        <p>{answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="submit-button-cnt">
            <button onClick={() => submitQuiz()}>Submit</button>
          </div>
        </div>
      ) : (
        <h1>Quiz er svart</h1>
      )}
    </div>
  );
}
