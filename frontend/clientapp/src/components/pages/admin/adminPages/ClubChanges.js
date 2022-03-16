import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../../parts/Loading";
import "../admin.css";

export default function QuizChanges() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const url = "http://localhost:5000/api/clubs";
  useEffect(() => {
    if (clubs.length == 0) {
      requestAPI();
    } else {
      console.log("club ", clubs);
    }
  }, [clubs]);

  function requestAPI() {
    axios
      .get(url)
      .then((response) => {
        setClubs(response.data);
        setLoading(false);
      })
      .catch(() => {
        setDisabled(false);
      });
  }

  return (
    <div>
      <h2>KYS Lagene</h2>
    </div>
  );
}
