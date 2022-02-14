import React, { useState, useEffect } from "react";
import "./videoStyle.css";
import axios from "axios";

const url = "http://127.0.0.1:5000/user/2";

export default function VideoTest() {
  const [state, setState] = useState();

  function fetchData() {
    try {
      const result = axios.get(url);
      setState(result);
      console.log(result);
      console.log("State", state);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="test">
        <h1>KYS</h1>
    </div>
  );
}
