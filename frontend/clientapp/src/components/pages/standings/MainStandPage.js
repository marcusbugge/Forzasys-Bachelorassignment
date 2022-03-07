import React, { useEffect, useState } from "react";
import "./standings.css";
import usericon from "../../../assets/icons/usericon.png";
import axios from "axios";
import Loading from "../../parts/Loading";

export default function MainStandPage() {
  const [standFilter, setStandFilter] = useState([0, 3]);
  const [stand, setStand] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    axios
      .get(
        "http://localhost:5000/api/leaderboard/" +
          standFilter[0] +
          "/" +
          standFilter[1]
      )
      .then((response) => {
        setStand(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  async function updateStanding(lower, upper) {
    setStandFilter([lower, upper]);
    setStand(userstats[lower]);
  }

  const userstats = [
    {
      name: "navn1",

      club: "club1",
      points: 100,
      posted_videos: 1,
    },
    {
      name: "navn2",
      club: "club2",
      points: 200,
      posted_videos: 2,
    },
    {
      name: "navn3",
      club: "club3",
      points: 300,
      posted_videos: 3,
    },

    {
      name: "navn4",
      club: "club4",
      points: 400,
      posted_videos: 4,
    },
    {
      name: "navn1",
      club: "club1",
      points: 100,
      posted_videos: 1,
    },
    {
      name: "navn2",
      club: "club2",
      points: 200,
      posted_videos: 2,
    },
  ];

  function StepButtons({ updateStanding }) {
    return (
      <div className="step-buttons">
        <button className="prev-btn">Prev</button>
        <button onClick={() => updateStanding(3, 5)} className="next-btn">
          Next
        </button>
      </div>
    );
  }

  /* FILTER REQUESTS */

  const [disabled, setDisabled] = useState(false);

  function kyse(hey) {
    console.log(hey);
    setDisabled(true);
  }

  return (
    <div>
      <div className="header">
        <h1>Standings</h1>
      </div>

      <div className="tables">
        <div className="filtering">
          <h1>Sort by</h1>
          <div className="sort-buttons">
            <button>Total points</button>
            <button>Total points by club</button>
            <button>Your club</button>
          </div>
        </div>
        <div className="table-header">
          <div className="rank">Rank</div>
          <div className="name">Name</div>
          <div className="club">Club</div>
          <div className="points">Points</div>
        </div>
        {loading ? (
          <div className="loading-standing">
            <Loading className="loading-signup" />
          </div>
        ) : (
          <div>
            <div className="table-content">
              {stand.map((post, index) => (
                <div className="table-element" key={index}>
                  <p>{post.rank}</p>
                  <p>{post.name}</p>
                  <div className="img-club">
                    {console.log(post.club_logo)}
                    <img
                      src={require("../../../assets/teamLogos/AIK-Logo.png")}
                      alt="logo"
                    />
                    <p>{post.club}</p>
                  </div>

                  <p>{post.points}</p>
                </div>
              ))}
            </div>
            <StepButtons updateStanding={updateStanding} />
          </div>
        )}
      </div>
    </div>
  );
}
