import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../../parts/Loading";
import "../admin.css";

export default function BadgeChanges() {
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const url = "http://localhost:5000/api/quizes";
  useEffect(() => {
    if (quiz.length == 0) {
      requestAPI();
    } else {
      console.log("quiz ", quiz);
    }
  }, [quiz]);

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

  return (
    <div>
      <h2>KYS Quizene</h2>
    </div>
  );
}
