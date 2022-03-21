import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../../parts/Loading";
import "../admin.css";

export default function BadgeChanges() {
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [visable, setVisable] = useState({
    element: null,
    bool: false,
  });

  const [answers, setAnswers] = useState({
    bool: false,
    list: [],
    element: null,
  });

  const url = "http://localhost:5000/api/quizes";
  useEffect(() => {
    if (quiz.length == 0) {
      requestAPI();
    } else {
      console.log("quiz ", quiz);
    }
  }, [quiz]);

  useEffect(() => {
    console.log(answers);
  }, [answers]);

  function requestAPI() {
    axios
      .get(url)
      .then((response) => {
        setQuiz(response.data);
        setLoading(false);
      })
      .catch(() => {
        setDisabled(false);
      });
  }

  function handleEditClick(index) {
    if (visable.bool && visable.element === index) {
      setVisable({
        element: null,
        bool: false,
      });
    } else if(visable.bool && visable.element !== index){
      setVisable({
        element: index,
        bool: true,
      });
    }else {
      setVisable({
        element: index,
        bool: true,
      });
    }
    setAnswers({
      bool: false,
      list: [],
      element: null,
    });
  }

  function handleAnswersClick(index) {
    if(answers.bool && answers.element !== index){
      setAnswers({
        bool: true,
        list: quiz[index].answers,
        element: index,
      });
    }
    else if (answers.bool && answers.element === index) {
      setAnswers({
        bool: false,
        list: [],
        element: null,
      });
    } else {
      setAnswers({
        bool: true,
        list: quiz[index].answers,
        element: index,
      });
    }
    setVisable({
      element: null,
      bool: false,
    });
  }

  const Edit = () => {
    return (
      <div className="change-area">
        <form className="form-quizs">
          <input type="text" name="name" placeholder="Enter a name" />
          <input
            type="text"
            name="description"
            placeholder="Enter a description"
          />
          <input type="text" name="category" placeholder="Enter a category" />
          <input type="text" name="points" placeholder="Enter points" />
          <button type="delete">Delete</button>
          <button type="submit">SAVE</button>
        </form>
      </div>
    );
  };

  const Answerkys = () => {
    return (
      <div className="answer-box">
        {answers.list.map((item, index) => (
          <div key={index}>
            Answer {index + 1} : {item}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-quiz-page">
      <div className="table-quiz">
        <div className="quiz-head">
          <div className="quiz-question">Question</div>
          <div className="quiz-points">Points</div>
          <div className="quiz-edit">Edit</div>
          <div className="quiz-answers">Answers</div>
        </div>

        {quiz.map((item, index) => (
          <div className="quiz-body" key={index}>
            <div className="body-row">
              <div className="quiz-question-content">{item.question}</div>
              <div className="quiz-points-content">{item.points}</div>
              <div className="quiz-edit-content">
                <button onClick={() => handleEditClick(index)}>EDIT</button>
              </div>
              <div className="quiz-answers-content">
                <button onClick={() => handleAnswersClick(index)}>
                  Answers
                </button>
              </div>
            </div>
            <div className="answers-view">
              {answers.bool && answers.element === index ? <Answerkys /> : ""}
            </div>
            <div className="change-box">
              {visable.element === index && visable.bool ? <Edit /> : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
