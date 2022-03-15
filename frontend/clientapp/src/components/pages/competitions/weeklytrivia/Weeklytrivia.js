import axios from "axios";
import React, { useEffect, useState } from "react";
import "./weeklytrivia.css";

export default function Weeklytrivia() {
  const [selectedAnswer, setSelectedAnswer] = useState();

  /* hentet liksom fra API */
  const [bool, setBool] = useState(true);
  const [questions, setQuestions] = useState(5);
  const [answeredQ, setAnsweredQ] = useState(0);
  const [triviaData, setTriviaData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await axios.get(
          "http://localhost:5000/api/trivia/data/3"
        );
        console.log("response", response);
        setTriviaData(response);
        console.log("q", triviaData[0].question);
        setLoading(false);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []);

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

  const [disabled, setDisabled] = useState(false);
  const [selected, setSelected] = useState();

  const [qCounter, setQCounter] = useState(0);

  const QuizElem = () => {
    return (
      <div className="qustionobj">
        <h1 className="question"></h1>
        <p className="question-text">{questionlist[qCounter].question}</p>
        <div className="answers">
          {questionlist[qCounter].answers.map((answer, i) => (
            <div
              key={i}
              disabled={disabled}
              onClick={(e) => {
                questionHandler(answer, questionlist[qCounter].correct);
                setSelected(answer);
              }}
              style={{
                backgroundColor: selected === answer ? "var(--secondary)" : "",
              }}
              className={"answers-cnt"}
            >
              <p className="trivia-ans">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const RenderQuiz = () => {
    if (qCounter === 0) {
      return (
        <div>
          <QuizElem counter={qCounter} />
        </div>
      );
    } else if (qCounter === 1) {
      return (
        <div>
          <QuizElem counter={qCounter} />
        </div>
      );
    } else if (qCounter === 2) {
      return (
        <div>
          <QuizElem counter={qCounter} />
        </div>
      );
    } else if (qCounter === 3) {
      return (
        <div>
          <QuizElem counter={qCounter} />
        </div>
      );
    } else {
      return (
        <div>
          <QuizElem counter={qCounter} />
        </div>
      );
    }
  };

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
          <p>Answered: {qCounter}</p>
        </div>
      </div>

      <div className="trivia-cnt">
        <div className="triviadata">
          <div className="picture-trivia"></div>
        </div>
      </div>

      {loading ? <RenderQuiz /> : ""}

      <button onClick={(e) => setQCounter(qCounter + 1)}>Neste kyser</button>

      {bool ? (
        <div className="quizbox-cnt">
          <div className="quizheader">
            <div className="questionselection"></div>
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
