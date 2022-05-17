import axios from "axios";
import React, { useEffect, useState } from "react";
import "./weeklytrivia.css";
import Timer from "./Timer";
import { useNavigate } from "react-router-dom";

export default function Weeklytrivia() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState(5);
  const [answeredQ, setAnsweredQ] = useState(0);
  const [triviaData, setTriviaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [solution, setSolution] = useState([]);
  const [result, setResult] = useState();
  const [quizScoresPoints, setQuizScoresPoints] = useState([]);
  const [quizScoresParticipations, setQuizScoresParticipations] = useState([]);
  const [quizTable, setQuizTable] = useState("points");
  let correct = "";
  let navigate = useNavigate();

  let loggedUser = {
    name: " ",
  };

  if (localStorage.getItem("loggedIn")) {
    loggedUser = JSON.parse(localStorage.getItem("user"));
  }

  useEffect(() => {
    if (triviaData.length === 0 && result === undefined) {
      fetchData();
    } else {
      setAnsweredQ(answeredQ);
    }
  }, [triviaData, answeredQ, result]);

  useEffect(() => {
    if (quizTable === "points" && quizScoresPoints.length === 0) {
      fetchQuizPoints();
    } else if (
      quizTable === "participations" &&
      quizScoresParticipations.length === 0
    ) {
      fetchQuizParticipations();
    } else {
      console.log("points", quizScoresPoints);
      console.log("Participations", quizScoresParticipations);
    }
  }, [quizTable, quizScoresPoints, quizScoresParticipations]);

  //"http://localhost:5000/api/quizes"
  //"http://localhost:5000/api/trivia/data/" + user.id

  async function fetchData() {
    try {
      await axios
        .get("http://localhost:5000/api/trivia/data/" + user.id)
        .then((response) => {
          console.log("trivia", response.data);
          if (response.status == 200) {
            sortTriviaData(response.data);
          } else {
            setResult(response.data);
            setSubmitted(true);
          }
          setLoading(false);
        });
    } catch (error) {
      console.error(error.message);
    }
  }

  async function fetchQuizPoints() {
    try {
      await axios
        .get("http://localhost:5000/api/quiz/leaderboard/points")
        .then((response) => {
          setQuizScoresPoints(response.data);
          console.log(quizScoresPoints);
        });
    } catch (error) {
      console.error(error.message);
    }
  }

  async function fetchQuizParticipations() {
    try {
      await axios
        .get("http://localhost:5000/api/quiz/leaderboard/participations")
        .then((response) => {
          setQuizScoresParticipations(response.data);
          console.log(quizScoresParticipations);
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
      questions: triviaData.length,
      correct: correct,
    };

    const headers = { "header-name": "value" };
    const config = { headers };

    const url = "http://localhost:5000/api/submitQuiz/" + user.id;
    await axios.post(url, data, config).then((res) => {
      console.log(res.status);
      console.log(res);
      fetchQuizParticipations();
      fetchQuizPoints();
    });
  }

  function readyToSubmit() {
    if (window.confirm("Du vi leverer quiz etter å ha trykket OK")) {
      submitQuiz();
    }
  }

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
              //disabled={false}
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
        {value ? (
          <p>Svar: {userTry}</p>
        ) : (
          <p style={{ color: "var(--red)" }}>Svar: Ikke besvart</p>
        )}
      </div>
    );
  };

  const QuizAnswers = () => {
    return (
      <div className="pre-submit-overview">
        <h3>Dine svar</h3>
        <div>
          {triviaData.map((quiz, index) => (
            <div className="quiz-answer-cnt">
              <div key={index} className="quiz-overview-cnt">
                <p style={{ color: "var(--gray1)" }}>
                  Spørsmål: {quiz.question}
                </p>
                <div className="quiz-answer-overview-cnt">
                  <AnsweredByUser quiz={quiz} />
                </div>
              </div>
              <div className="quiz-answer-btn">
                <button onClick={() => setQCounter(index)}>Endre</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  function submittedQuizPoints() {
    let counter = 0;
    let points = 0;
    solution.map((element) => {
      element.answers.map((elm) => {
        if (elm.clicked === elm.correct) {
          counter++;
          points += 2;
        }
      });
    });
    if (counter === triviaData.length) points += 5;
    return points;
  }

  const Solution = () => {
    return (
      <div className="quiz-solution">
        <p className="quiz-solution-element">
          Dine poeng denne uken: {submittedQuizPoints()}
        </p>
        {solution.map((element, index) => (
          <div key={index} className="quiz-solution-element">
            <div>
              <p style={{ color: "var(--gray1)" }}>{element.question}</p>
            </div>
            {element.answers.map((answer, index) => (
              <div key={index}>
                {answer.clicked !== "" ? (
                  <p
                    style={
                      answer.clicked === answer.correct
                        ? { color: "#79ca00" }
                        : { color: "var(--red)" }
                    }
                  >
                    Du svarte: {answer.clicked}
                  </p>
                ) : (
                  <p style={{ color: "var(--red)" }}>Du svarte ikke</p>
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
    } else if (submitted && triviaData.length > 0) {
      return <Solution />;
    }
    return "";
  };

  const LeaderboardQuiz = () => {
    return (
      <div className="quiz-table">
        <div className="quiz-table-head">
          <div className="qth-rank">Rangering</div>
          <div className="qth-name">Navn</div>
          <div className="qth-participations">Deltatt</div>
          <div className="qth-maxScore">Totale quiz poeng</div>
        </div>
        <div className="quiz-table-body">
          {quizTable === "points" ? (
            <div>
              {quizScoresPoints.map((element, index) => (
                <div
                  className={
                    loggedUser.name === element.name
                      ? "qtb-row-active"
                      : "qtb-row"
                  }
                  onClick={() => navigate("/" + element.username)}
                >
                  <div className="qtb-rank">{index + 1}</div>
                  <div className="qtb-name">{element.name}</div>
                  <div className="qtb-participations">
                    {element.participations}
                  </div>
                  <div className="qtb-maxScore">
                    {element.total_quiz_points}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {quizScoresParticipations.map((element, index) => (
                <div
                  className={
                    loggedUser.name === element.name
                      ? "qtb-row-active"
                      : "qtb-row"
                  }
                  onClick={() => navigate("/" + element.username)}
                >
                  <div className="qtb-rank">{index + 1}</div>
                  <div className="qtb-name">{element.name}</div>
                  <div className="qtb-participations">
                    {element.participations}
                  </div>
                  <div className="qtb-maxScore">
                    {element.total_quiz_points}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {quizTable === "points" ? (
          <button onClick={() => setQuizTable("participations")}>
            Deltatt
          </button>
        ) : (
          <button onClick={() => setQuizTable("points")}>Poeng</button>
        )}
      </div>
    );
  };

  if (!loading) {
    return (
      <div className="quizpage">
        <div className="header">
          <h1>Ukentlig quiz</h1>
        </div>
        <div className="trivia-info">
          <div
            className={
              triviaData.length > 0 ? "vertical-stroke1" : "vertical-stroke2"
            }
          />
          <div className="trivia-text">
            {triviaData.length === 0 ? (
              <div className="trivia-data-holder">
                <div className="trivia-data-info">
                  Du har tatt quizen denne uken, ny quiz kommer om: {<Timer />}
                </div>
                <div className="trivia-data">
                  <p>Forrige resultat: </p>
                  <p>
                    Antall riktige: {result.correct}/{result.questions}
                  </p>
                </div>
              </div>
            ) : (
              <div className="trivia-data-holder">
                <div className="trivia-data-info">
                  <p>Svar på vår ukentlige quiz for å klatre på poengtavla!</p>
                </div>
                <div className="trivia-data">
                  <p>
                    Besvart: {answeredQ}/{triviaData.length}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="trivia-cnt">
          <div className="triviadata">
            <div className="picture-trivia"></div>
          </div>
        </div>
        {!loading ? <RenderQuiz /> : ""}
        <div className="prev-next-button">
          {qCounter === 0 || qCounter === triviaData.length || submitted ? (
            <div className="previous-button" />
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
        <LeaderboardQuiz />
      </div>
    );
  } else {
    return (
      <div className="quizpage">
        <div className="header">
          <h1>Ukentlig quiz</h1>
        </div>
        <div className="space-quizpage">
          <LeaderboardQuiz />
        </div>
      </div>
    );
  }
}
