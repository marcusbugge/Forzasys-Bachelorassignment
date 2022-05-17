import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../../parts/Loading";
import "../admin.css";

export default function QuizChanges() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [visable, setVisable] = useState({
    element: null,
    bool: false,
  });

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
        console.log(response.data);
      })
      .catch(() => {
        setDisabled(false);
      });
  }

  function handleClick(index) {
    if (visable.bool && visable.element !== index) {
      setVisable({
        element: index,
        bool: true,
      });
    } else if (visable.bool && visable.element === index) {
      setVisable({
        element: null,
        bool: false,
      });
    } else {
      setVisable({
        element: index,
        bool: true,
      });
    }
  }

  async function handlePutSubmit(event) {
    event.preventDefault();

    const club_to_return = {
      name: event.target.name.value,
      nationality: event.target.nationality.value,
    };

    const url = "http://localhost:5000/api/club/" + (visable.element + 1);
    if (window.confirm("Er du sikker på at du vil endre på dette laget?")) {
      await axios
        .put(url, club_to_return)
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

  const Edit = () => {
    return (
      <div className="change-area-club">
        <div className="clubChange-headers">
          <p>Name</p>
          <p>Nationality</p>
        </div>
        <form className="form-clubs" onSubmit={handlePutSubmit}>
          <input
            type="text"
            name="name"
            placeholder={clubs[visable.element].name}
            autoComplete="off"
          />
          <input
            type="text"
            name="nationality"
            placeholder={clubs[visable.element].nationality}
            autoComplete="off"
          />
            <button className="button-edit" type="reset">
              Undo
            </button>
            <button className="button-submit" type="submit">
              SAVE
            </button>
        </form>
      </div>
    );
  };

  return (
    <div className="admin-club-page">
      <div className="table-clubs">
        <div className="clubs-head">
          <div className="club-logo">Logo</div>
          <div className="club-name">Name</div>
          <div className="club-nat">Nationality</div>
          <div className="club-edit">Edit</div>
        </div>

        {clubs.map((item, index) => (
          <div className="clubs-body" key={index}>
            <div className="body-row">
              <div className="club-logo-content">
                <img
                  className="club-img"
                  src={require("../../../../assets/teamLogos/" + item.logo)}
                />
              </div>
              <div className="club-name-content">{item.name}</div>
              <div className="club-nat-content">{item.nationality}</div>
              <div className="club-edit-content">
                <button
                  className="button-edit"
                  onClick={() => handleClick(index)}
                >
                  EDIT
                </button>
              </div>
            </div>
            <div className="change-box">
              {visable.element === index && visable.bool ? <Edit /> : ""}
            </div>
          </div>
        ))}
      </div>
      <div className="addClub-form">
        <h3>Add a club</h3>
        <form>
          <input
            type="text"
            name="name"
            required="required"
            placeholder="Enter a name"
          />
          <input
            type="text"
            name="nationality"
            required="required"
            placeholder="Enter nationality"
          />
          <button className="button-submit" type="submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
