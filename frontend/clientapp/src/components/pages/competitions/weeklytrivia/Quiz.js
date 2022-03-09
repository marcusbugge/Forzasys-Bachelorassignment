import axios from "axios";
import React, { useEffect, useState } from "react";
import SubmitConfirmation from "./SubmitConfirmation";
import "./weeklytrivia.css";

export default function Quiz() {
  const [selectedAnswer, setSelectedAnswer] = useState();

  /* hentet liksom fra API */
  

  const [questions, setQuestions] = useState(5);
  const [answeredQ, setAnsweredQ] = useState(0);

  const [triviaData, setTriviaData] = useState([]);

  useEffect(() => {
    getQuestions();
  }, []);
  async function getQuestions() {
    const henticon = await axios.get("http://localhost:5000/api/trivia/data");
    console.log("Req: ", henticon);
    const data = henticon.data;
    setTriviaData(data);
    console.log("State: ", triviaData);
  }

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
    localStorage.setItem("sendtInn", true);
  }

  const [disabled, setDisabled] = useState(false);

  function clickedAnswer(e) {
    console.log(e);
    e.target.className.disabled(true);
  }

  return (
<div>
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

        <div className="quizbox-cnt">
          <div className="quizheader">
            <div className="questionselection">
              {triviaData.map((qObj, index) => (
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
                        disabled={disabled}
                        onClick={(e) => {
                          questionHandler(answer, qObj.correct);
                          clickedAnswer(e);
                        }}
                        className="answers-cnt"
                        tabIndex="0"
                      >
                        <p className="trivia-ans">{answer}</p>
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
</div>
  );
}