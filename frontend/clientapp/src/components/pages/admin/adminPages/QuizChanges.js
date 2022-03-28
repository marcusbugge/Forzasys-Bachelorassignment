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
  const [answersEdit, setAnswersEdit] = useState({
    bool: false,
    list: [],
    element: null,
  });

  const [newQuestion, setNewQuestion] = useState();
  const [correct, setCorrect] = useState();
  const [correctEdit, setCorrectEdit] = useState();
  const newAnswers = [];
  const [notClicked, setNotClicked] = useState(true);

  const url = "http://localhost:5000/api/quizes";
  useEffect(() => {
    if (quiz.length == 0) {
      requestAPI();
    } else {
      console.log("quiz ", quiz);
    }
  }, [quiz]);

  useEffect(() => {
    console.log(answersEdit);
  }, [answersEdit]);

  async function requestAPI() {
    setNotClicked(true);
    setCorrect();
    await axios
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
    } else if (visable.bool && visable.element !== index) {
      setVisable({
        element: index,
        bool: true,
      });
    } else {
      setVisable({
        element: index,
        bool: true,
      });
    }
    setAnswersEdit({
      bool: false,
      list: [],
      element: null,
    });
  }

  function handleAnswersClick(index) {
    if (answersEdit.bool && answersEdit.element !== index) {
      setAnswersEdit({
        bool: true,
        list: quiz[index].answers,
        element: index,
      });
    } else if (answersEdit.bool && answersEdit.element === index) {
      setAnswersEdit({
        bool: false,
        list: [],
        element: null,
      });
    } else {
      setAnswersEdit({
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

  async function deleteQuestuon(id) {
    const url = "http://localhost:5000/api/question/" + id;
    if (window.confirm("Er du sikker på at du vil slette spørsmålet?")) {
      await axios
        .delete(url)
        .then((response) => {
          console.log(response.status);
          console.log(response);
          requestAPI();
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  }

  async function handleSubmitPut(event) {
    event.preventDefault();

    const question_to_return = {
      question: event.target.question.value,
      points: event.target.points.value,
    };

    const url =
      "http://localhost:5000/api/question/" + quiz[visable.element].id;
    if (window.confirm("Er du sikker på at du vil endre på spørsmålet?")) {
      await axios
        .put(url, question_to_return)
        .then((response) => {
          console.log(response.status);
          console.log(response.data);
          setVisable({
            element: null,
            bool: false,
          });
          requestAPI();
        })
        .catch((e) => console.log("something went wrong :(", e));
    }
  }

  function handleQuestion(event) {
    event.preventDefault();

    const question = {
      question: event.target.question.value,
      points: event.target.points.value,
    };

    setNewQuestion(question);
    console.log(question);
    event.target.question.value = "";
    event.target.points.value = "";
  }

  function handleAnswers(event) {
    event.preventDefault();
    if (!correct) {
      setNotClicked(false);
    } else {
      newAnswers.push({
        content: event.target.answer1.value,
        correct: false,
      });
      newAnswers.push({
        content: event.target.answer2.value,
        correct: false,
      });
      newAnswers.push({
        content: event.target.answer3.value,
        correct: false,
      });
      newAnswers.push({
        content: event.target.answer4.value,
        correct: false,
      });
      console.log(correct);
      newAnswers[correct].correct = true;

      postQuestion(event);
    }
  }

  async function postQuestion(event) {
    const question_to_post = {
      question: newQuestion.question,
      points: newQuestion.points,
      answers: newAnswers,
    };

    console.log(question_to_post);

    const headers = { "header-name": "value" };
    const config = { headers };

    const url = "http://localhost:5000/api/question";
    await axios.post(url, question_to_post, config).then((res) => {
      console.log(res.status);
      event.target.answer1.value = "";
      event.target.answer2.value = "";
      event.target.answer3.value = "";
      event.target.answer4.value = "";
      setNewQuestion(null);
      requestAPI();
    });
  }

  const Edit = () => {
    return (
      <div className="change-area">
        <form className="form-area" onSubmit={handleSubmitPut}>
          <input type="text" name="question" placeholder="Enter question" />
          <input type="number" name="points" placeholder="Enter points" />
          <button type="reset">Undo</button>
          <button type="submit">SAVE</button>
        </form>
      </div>
    );
  };

  async function handleSubmitPutAnswers(event) {
    event.preventDefault();

    let alternatives = [
      {
        content: event.target.alternativ1.value,
        correct: false,
      },
      {
        content: event.target.alternativ2.value,
        correct: false,
      },
      {
        content: event.target.alternativ3.value,
        correct: false,
      },
      {
        content: event.target.alternativ4.value,
        correct: false,
      },
    ];

    if(correctEdit){
      alternatives[correctEdit].correct = true;
    }



    const url = "http://localhost:5000/api/answers/" + quiz[answersEdit.element].id;
    if (window.confirm("Er du sikker på at du vil endre på spørsmålet?")) {
      await axios
        .put(url, alternatives)
        .then((response) => {
          console.log(response.status);
          console.log(response.data);
          setVisable({
            element: null,
            bool: false,
          });
          setCorrectEdit();
          setAnswersEdit({
            bool: false,
            list: [],
            element: null,
          });
          requestAPI();
        })
        .catch((e) => console.log("something went wrong :(", e));
    }
  }

  return (
    <div className="admin-quiz-page">
      <div className="table-quiz">
        <div className="quiz-head">
          <div className="quiz-question">Question</div>
          <div className="quiz-points">Points</div>
          <div className="quiz-edit">Edit</div>
          <div className="quiz-answers">Answers</div>
          <div className="quiz-delete">Delete</div>
        </div>

        {quiz.map((item, index) => (
          <div className="quiz-body" key={index}>
            <div className="body-row">
              <div className="quiz-question-content">{item.question}</div>
              <div className="quiz-points-content">{item.points}</div>
              <div className="button-edit-quiz">
                <button onClick={() => handleEditClick(index)}>EDIT</button>
              </div>
              <div className="button-answer-quiz">
                <button onClick={() => handleAnswersClick(index)}>
                  Answers
                </button>
              </div>
              <div className="button-delete-quiz">
                <button onClick={() => deleteQuestuon(item.id)}>Delete</button>
              </div>
            </div>
            <div className="answers-view">
              {answersEdit.bool && answersEdit.element === index ? (
                <div className="answer-box">
                  <form onSubmit={handleSubmitPutAnswers}>
                    <p>Alternativ 1</p>
                    <input
                      type="text"
                      name="alternativ1"
                      placeholder={answersEdit.list[0].split(", ")[0]}
                    />
                    <label>{answersEdit.list[0].split(", ")[1]}</label>
                    <p>Alternativ 2</p>
                    <input
                      type="text"
                      name="alternativ2"
                      placeholder={answersEdit.list[1].split(", ")[0]}
                    />
                    <label>{answersEdit.list[1].split(", ")[1]}</label>
                    <p>Alternativ 3</p>
                    <input
                      type="text"
                      name="alternativ3"
                      placeholder={answersEdit.list[2].split(", ")[0]}
                    />
                    <label>{answersEdit.list[2].split(", ")[1]}</label>
                    <p>Alternativ 4</p>
                    <input
                      type="text"
                      name="alternativ4"
                      placeholder={answersEdit.list[3].split(", ")[0]}
                    />
                    <label>{answersEdit.list[3].split(", ")[1]}</label>
                    <select onChange={(e) => setCorrectEdit(e.target.value)}>
                      <option hidden selected disabled>
                        Velg riktig alternativ
                      </option>
                      <option value="0">Alternativ 1</option>
                      <option value="1">Alternativ 2</option>
                      <option value="2">Alternativ 3</option>
                      <option value="3">Alternativ 4</option>
                    </select>
                    <button type="submit">Submit</button>
                    <button type="reset">Undo</button>
                  </form>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="change-box">
              {visable.element === index && visable.bool ? <Edit /> : ""}
            </div>
          </div>
        ))}
      </div>
      <div className="add-question">
        <h1>Add question</h1>
        <div>
          {!newQuestion ? (
            <form onSubmit={handleQuestion}>
              <input
                type="text"
                name="question"
                placeholder="Write the question"
                required={true}
              />
              <input
                type="number"
                name="points"
                placeholder="Write points for correct answer"
                required={true}
              />
              <button type="submit">Submit</button>
            </form>
          ) : (
            <form onSubmit={handleAnswers}>
              <input
                type="text"
                name="answer1"
                placeholder="Alternative 1"
                required={true}
              />
              <input
                type="text"
                name="answer2"
                placeholder="Alternative 2"
                required={true}
              />
              <input
                type="text"
                name="answer3"
                placeholder="Alternative 3"
                required={true}
              />
              <input
                type="text"
                name="answer4"
                placeholder="Alternative 4"
                required={true}
              />
              <select onChange={(e) => setCorrect(e.target.value)}>
                <option hidden selected disabled>
                  Velg riktig alternativ
                </option>
                <option value="0">Alternativ 1</option>
                <option value="1">Alternativ 2</option>
                <option value="2">Alternativ 3</option>
                <option value="3">Alternativ 4</option>
              </select>
              <button type="submit">Submit</button>
              <button onClick={() => setNewQuestion("")}>Abort</button>
              {!correct && !notClicked ? <p>Velg riktig alternativ</p> : ""}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
