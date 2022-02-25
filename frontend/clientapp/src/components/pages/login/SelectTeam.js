import axios from "axios";
import React, { useEffect, useState } from "react";
import "./createuser.css";

export default function SelectTeam(props) {
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://127.0.0.1:5000/api/teams"
        );
        setTeams(response);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  function selectTeam(team) {
    localStorage.setItem("team", team);
    props.setTeam(team);
    console.log(localStorage.getItem("team"));
  }

  return (
    <div className="testest">
      <h1 className="chooseteamh1">Choose your favorite team!</h1>
      <div className="chooseteam-cnt">
        {teams.map((item) => (
          <div
            onClick={(e) => selectTeam(item.id)}
            key={item.name}
            className="team"
          >
            <div className="team-img-cnt" value={item.name}>
              <img src={item.logo} alt={item.name} />
            </div>

            <h1>{item.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
