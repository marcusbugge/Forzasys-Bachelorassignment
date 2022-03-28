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
    if (triviaData.length == 0) {
      fetchData();
    } else {
      console.log(triviaData);
    }
  }, [triviaData]);

  async function fetchData() {
    try {
      await axios.get("http://localhost:5000/api/quizes").then((response) => {
        setTriviaData(response.data);
        setLoading(false);
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  const previousQuestion = (e, c) => {
    console.log("Svar:" + e);
    console.log(c);
    if (c >= 0 && c <= triviaData.length) {
      setQCounter(c);
    } else {
      console.log("Cant go that way");
    }
  };

  const nextQuestion = (e, c) => {
    console.log("Svar:" + e);
    console.log(c);
    if (c >= 0 && c <= triviaData.length) {
      if (e === undefined) {
        console.log("Must select answer");
      } else {
        setQCounter(c);
        setSelected(undefined);
      }
    } else {
      console.log("Cant go that way");
    }
  };

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
      spørsmål1: "Spørsmå5",
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
    if (qCounter !== triviaData.length) {
      console.log("You must answer all questions!!!!!");
    } else {
      console.log("submit");
    }
  }

  const [disabled, setDisabled] = useState(false);
  const [selected, setSelected] = useState();

  const [qCounter, setQCounter] = useState(0);

  const QuizElem = () => {
    return (
      <div className="qustionobj">
        <h1 className="question">Spørsmål {qCounter + 1}</h1>
        <p className="question-text">{triviaData[qCounter].question}</p>
        <div className="answers">
          {triviaData[qCounter].answers.map((answer, i) => (
            <div
              key={i}
              disabled={disabled}
              onClick={(e) => {
                questionHandler(answer, triviaData[qCounter].correct);
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
      console.log(qCounter);
      return (
        <div>
          <QuizElem counter={qCounter} />
        </div>
      );
    } else if (qCounter === 1) {
      console.log(qCounter);
      return (
        <div>
          <QuizElem counter={qCounter} />
        </div>
      );
    } else if (qCounter === 2) {
      console.log(qCounter);
      return (
        <div>
          <QuizElem counter={qCounter} />
        </div>
      );
    } else if (qCounter === 3) {
      console.log(qCounter);
      return (
        <div>
          <QuizElem counter={qCounter} />
        </div>
      );
    } else if (qCounter === 4) {
      console.log(qCounter);
      return (
        <div>
          <QuizElem counter={qCounter} />
        </div>
      );
    } else {
      console.log(qCounter);
      return null;
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
          <p>Questions: {triviaData.length}</p>
          <p>Answered: {qCounter}</p>
        </div>
      </div>
      <div className="trivia-cnt">
        <div className="triviadata">
          <div className="picture-trivia"></div>
        </div>
      </div>
      {!loading ? <RenderQuiz /> : ""}
      <button
        className="previous-button"
        onClick={(e) => previousQuestion(selected, qCounter - 1)}
      >
        Forrige kyser
      </button>
      <button
        className="next-button"
        onClick={(e) => nextQuestion(selected, qCounter + 1)}
      >
        Neste kyser
      </button>

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
