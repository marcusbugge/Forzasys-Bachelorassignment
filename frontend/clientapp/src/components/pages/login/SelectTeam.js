import axios from "axios";
import React, { useEffect, useState } from "react";
import "./login.css";

export default function SelectTeam() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const teams = [
    {
      name: "Rosenborg",
      nickname: "RBK",
      nationality: "Norway",
      logo: "",
    },
    {
      name: "Sarpsborg 08",
      nickname: "S08",
      nationality: "Norway",
      logo: "",
    },
    {
      name: "Lillestrøm",
      nickname: "LSK",
      nationality: "Norway",
      logo: "",
    },
    {
      name: "Hønefoss",
      nickname: "HBK",
      nationality: "Norway",
      logo: "",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: response } = await axios.get(
          "http://127.0.0.1:5000/api/teams"
        );
        setData(response);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      {" "}
      {loading && <div>Loading</div>}
      {!loading && (
        <div className="chooseteam-cnt">
          <h2>ahahahahah</h2>
          {teams.map((item) => (
            <span>{item.name}</span>
          ))}
        </div>
      )}
    </div>
  );
}
