import axios from "axios";
import React, { useEffect, useState } from "react";
import "./weeklytrivia.css";
import Timer from "./Timer";

export default function Weeklytrivia() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState(5);
  const [answeredQ, setAnsweredQ] = useState(0);
  const [triviaData, setTriviaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [solution, setSolution] = useState([]);
  let correct = "";

  useEffect(() => {
    if (triviaData.length === 0) {
      fetchData();
    } else {
      setAnsweredQ(answeredQ);
      console.log(triviaData);
    }
  }, [triviaData, answeredQ]);

  async function fetchData() {
    try {
      await axios
        .get("http://localhost:5000/api/trivia/data/" + user.id)
        .then((response) => {
          console.log(response);
          sortTriviaData(response.data);
          console.log(response.status);
        });
    } catch (error) {
      console.error(error.message);
    }
  }

  function sortTriviaData(data) {
    const questionList = [];
    data.map((trivia) => {
      const question = {
        id: trivia.id,
        points: trivia.points,
        question: trivia.question,
        answers: [
          {
            content: trivia.answers[0].split(", ")[0],
            bool: trivia.answers[0].split(", ")[1],
            clicked: false,
          },
          {
            content: trivia.answers[1].split(", ")[0],
            bool: trivia.answers[1].split(", ")[1],
            clicked: false,
          },
          {
            content: trivia.answers[2].split(", ")[0],
            bool: trivia.answers[2].split(", ")[1],
            clicked: false,
          },
          {
            content: trivia.answers[3].split(", ")[0],
            bool: trivia.answers[3].split(", ")[1],
            clicked: false,
          },
        ],
      };
      questionList.push(question);
    });
    setTriviaData(questionList);
    setLoading(false);
  }

  function submitQuiz() {
    let fasit = [];
    let counter = 0;
    triviaData.map((question) => {
      let holder = { question: question.question, answers: [] };
      let clicked = "";
      let bool = "";
      question.answers.map((answer) => {
        if (answer.clicked && answer.bool === "True") {
          clicked = answer.content;
          bool = answer.content;
          counter++;
        }
        if (answer.clicked) {
          clicked = answer.content;
        }
        if (answer.bool === "True") {
          bool = answer.content;
        }
      });
      let answers = {
        clicked: clicked,
        correct: bool,
      };
      holder.answers.push(answers);
      fasit.push(holder);
    });
    correct = counter;
    setSolution(fasit);
    setSubmitted(true);
    postQuiz();
  }

  async function postQuiz() {
    const data = {
      correct: correct,
    };

    const headers = { "header-name": "value" };
    const config = { headers };

    const url = "http://localhost:5000/api/submitQuiz/" + user.id;
    await axios.post(url, data, config).then((res) => {
      console.log(res.status);
      console.log(res);
    });
  }

  function readyToSubmit() {
    if (window.confirm("Du vi leverer quiz etter å ha trykket OK")) {
      submitQuiz();
    }
  }

  const [disabled, setDisabled] = useState(false);

  const [qCounter, setQCounter] = useState(0);

  function handleAnswerClick(answer) {
    triviaData[qCounter].answers.map((answer) => (answer.clicked = false));
    answer.clicked = true;

    let counter = 0;
    triviaData.map((quiz) => {
      quiz.answers.map((answer) => {
        if (answer.clicked === true) {
          counter += 1;
        }
      });
    });
    setAnsweredQ(counter);
  }

  const [test, setTest] = useState("");

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
              onClick={() => {
                handleAnswerClick(answer);
                setTest(answer);
              }}
              style={{
                backgroundColor:
                  answer.clicked === true ? "var(--secondary)" : "",
              }}
              className={"answers-cnt"}
            >
              <p className="trivia-ans">{answer.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AnsweredByUser = (props) => {
    let value;
    let userTry = "";
    return (
      <div>
        {props.quiz.answers.map((answer) => {
          if (answer.clicked == true) {
            value = true;
            userTry = answer.content;
          }
        })}
        {value ? <p>Svar: {userTry}</p> : <p>Svar: Ikke besvart</p>}
      </div>
    );
  };

  const QuizAnswers = () => {
    return (
      <div>
        <h3>Dine svar</h3>
        {triviaData.map((quiz, index) => (
          <div
            key={index}
            className="quiz-overview-cnt"
            onClick={() => setQCounter(index)}
          >
            <p>Spørsmål: {quiz.question}</p>
            <div className="quiz-answer-overview-cnt">
              <AnsweredByUser quiz={quiz} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const Solution = () => {
    return (
      <div>
        {solution.map((element, index) => (
          <div key={index}>
            <p>{element.question}</p>
            {element.answers.map((answer, index) => (
              <div key={index}>
                {answer.clicked !== "" ? (
                  <p>Du svarte: {answer.clicked}</p>
                ) : (
                  <p>Du svarte ikke</p>
                )}
                <p>Riktig svar: {answer.correct}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const RenderQuiz = () => {
    if (qCounter < triviaData.length && !submitted) {
      return (
        <div className="question-cnt">
          <QuizElem />
        </div>
      );
    } else if (qCounter === triviaData.length && !submitted) {
      setFinished(true);
      return (
        <div className="quiz-overview">
          <QuizAnswers />
        </div>
      );
    } else if (submitted) {
      return <Solution />;
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
          {triviaData.length === 0 ? (
            <p>
              Du har allerede tatt quizen denne uken, ny quiz kommer {<Timer />}
            </p>
          ) : (
            <p>
              Answer our weekly trivia to earn points to climb on the ladder!
            </p>
          )}
        </div>
        <div className="trivia-data">
          <p>Questions: {triviaData.length}</p>
          <p>Answered: {answeredQ}</p>
        </div>
      </div>
      <div className="trivia-cnt">
        <div className="triviadata">
          <div className="picture-trivia"></div>
        </div>
      </div>
      {!loading ? <RenderQuiz /> : ""}
      <div className="prev-next-button">
        {qCounter === 0 || qCounter === triviaData.length ? (
          ""
        ) : (
          <div className="previous-button">
            <button onClick={() => setQCounter(qCounter - 1)}>
              Forrige spørsmål
            </button>
          </div>
        )}
        {finished && qCounter !== triviaData.length ? (
          <div className="overview-button">
            <button onClick={() => setQCounter(triviaData.length)}>
              Oversikt
            </button>
          </div>
        ) : (
          ""
        )}
        {qCounter < triviaData.length && !submitted ? (
          <div className="next-button">
            <button onClick={() => setQCounter(qCounter + 1)}>
              Neste spørsmål
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="quizbox-cnt">
        <div className="quizheader">
          <div className="questionselection"></div>
        </div>
        {!submitted && triviaData.length !== 0 ? (
          <div className="submit-button-cnt">
            <button onClick={() => readyToSubmit()}>Submit</button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
