import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../../parts/Loading";
import "../admin.css";

export default function BadgeChanges() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [visable, setVisable] = useState({
    element: null,
    bool: false
  });

  const url = "http://localhost:5000/api/badges";
  useEffect(() => {
    if (badges.length == 0) {
      requestAPI();
    } else {
      console.log("badges", badges);
    }
    console.log(visable);
  }, [badges]);

  useEffect(() => {
    console.log(visable);
  }, [visable]);

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

  function handleClick(index) {
    if (visable.bool && visable.element !== index) {
      setVisable({
        element: index,
        bool: true,
      });
    } else if(visable.bool && visable.element === index){
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

  const Edit = () => {
    return (
      <div className="change-area">
        <form className="form-badges">
          <input type="text" name="name" placeholder="Enter a name" />
          <input
            type="text"
            name="description"
            placeholder="Enter a description"
          />
          <input type="text" name="category" placeholder="Enter a category" />
          <input type="text" name="points" placeholder="Enter points" />
          <button type="delete">Delete</button>
          <button type="submit">SAVE</button>
        </form>
      </div>
    );
  };

  return (
    <div className="admin-badge-page">
      <div className="table-badges">
        <div className="badges-head">
          <div className="badge-name">Name</div>
          <div className="badge-desc">Description</div>
          <div className="badge-cat">Category</div>
          <div className="badge-points">Points</div>
          <div className="badge-edit">Edit</div>
        </div>

        {badges.map((item, index) => (
          <div className="badges-body" key={index}>
            <div className="body-row">
              <div className="badge-pic-content">
                <img
                  className="badge-img"
                  src={require("../../../../assets/badgeIcons/" + item.picture)}
                />
              </div>
              <div className="badge-name-content">{item.name}</div>
              <div className="badge-desc-content">{item.description}</div>
              <div className="badge-cat-content">{item.category}</div>
              <div className="badge-points-content">{item.points_needed}</div>
              <div className="badge-edit-content">
                <button onClick={() => handleClick(index)}>EDIT</button>
              </div>
            </div>
            <div className="change-box">
              {visable.element === index && visable.bool ? <Edit /> : ""}
            </div>
          </div>
        ))}
      </div>
      <h2>Add badge</h2>
      <form>
        <input
          type="text"
          name="name"
          required="required"
          placeholder="Enter a name"
        />
        <input
          type="text"
          name="description"
          required="required"
          placeholder="Enter description"
        />
        <input
          type="text"
          name="category"
          required="required"
          placeholder="Enter a category"
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
