import axios from "axios";
import React, { useEffect, useState } from "react";
import "./createuser.css";

export default function SelectTeam() {
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

  return (
    <div className="testest">
      <div className="chooseteam-cnt">
        {teams.map((item) => (
          <div className="team">
            <div className="team-img-cnt">
              <img src={item.logo} alt="" />
            </div>

            <h1>{item.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
