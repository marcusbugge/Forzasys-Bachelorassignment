import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../../parts/Loading";
import "../admin.css";

export default function BadgeChanges() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);

  const url = "http://localhost:5000/api/badges";
  useEffect(() => {
    if (badges.length == 0) {
      requestAPI();
    } else {
      console.log("badge ", badges);
    }
  }, [badges]);

  function requestAPI() {
    axios
      .get(url)
      .then((response) => {
        setBadges(response.data);
        setLoading(false);
      })
      .catch(() => {
        setDisabled(false);
      });
  }

  return (
    <div>
      <h2>KYS Badges</h2>
    </div>
  );
}
