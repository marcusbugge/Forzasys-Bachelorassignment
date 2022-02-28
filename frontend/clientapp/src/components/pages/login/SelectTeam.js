import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../../parts/Loading";

import "./createuser.css";

export default function SelectTeam(props) {
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get("http://localhost:5000/api/teams")
        .then((response) => checkData(response.data))
        .catch((error) => {
          console.error("There was an error!", error);
        });
    };

    fetchData();
  }, []);

  function checkData(data) {
    if (data !== "") {
      setTeams(data);
      setLoading(false);
    }
  }

  function selectTeam(team) {
    localStorage.setItem("team", team);
    props.setTeam(team);
    console.log(localStorage.getItem("team"));
  }

  return (
    <div className="testest">
      {loading ? (
        <Loading className="loading-signup" />
      ) : (
        <div>
          <h1 className="chooseteamh1">Choose your favorite team!</h1>
          <div className="chooseteam-cnt">
            {teams.map((item) => (
              <div
                onClick={(e) => selectTeam(item.id)}
                key={item.name}
                className="team"
              >
                <div className="team-img-cnt" value={item.name}>
                  <img src={require("../../../assets/teamLogos/"+item.logo)} alt={item.name} />
                </div>

                <h1>{item.name}</h1>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
