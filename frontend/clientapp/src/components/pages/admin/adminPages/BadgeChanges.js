import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Loading from "../../../parts/Loading";
import "../admin.css";

export default function BadgeChanges() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [visable, setVisable] = useState({
    element: null,
    bool: false,
  });
  const [image, setImage] = useState(null);

  const inputRef = useRef();
  const [source, setSource] = useState();

  const url = "http://localhost:5000/api/badges";

  useEffect(() => {
    if (badges.length == 0) {
      requestAPI();
    } else {
      console.log("badges", badges);
    }
  }, [badges]);

  useEffect(() => {}, [visable]);

  async function requestAPI() {
    await axios
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

  async function handleSubmitPut(event) {
    event.preventDefault();

    const badge_to_return = {
      name: event.target.name.value,
      description: event.target.description.value,
      picture: badges[visable.element].picture,
      level: event.target.level.value,
      category: event.target.category.value,
      points_needed: event.target.points.value,
    };

    const url = "http://localhost:5000/api/badge/" + (visable.element + 1);
    if (window.confirm("Er du sikker på at du vil endre på badgen?")) {
      await axios
        .put(url, badge_to_return)
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

  async function deleteBadge(id) {
    const url = "http://localhost:5000/api/badge/" + id;

    if (window.confirm("Er du sikker på at du vil slette badgen?")) {
      await axios
        .delete(url)
        .then((response) => {
          console.log(response.status);
          console.log(response.data);
          requestAPI();
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  }

  const handlePicture = (event) => {
    setImage(event.target.files[0]);
    const url = URL.createObjectURL(event.target.files[0]);
    console.log(event.target.files[0]);
    setSource(url);
  };

  async function handleSubmitPost() {
    const data = new FormData();
    data.append("file", image.selectedFile);
    await axios.post("public", data).then((res) => {
      console.log(res);
    });
  }

  const Edit = () => {
    return (
      <div className="change-area-badge">
        <div className="form-area-badge">
          <div className="badge-info">
            <p className="p-name">Name</p>
            <p className="p-desc">Description</p>
            <p className="p-level">Level</p>
            <p className="p-cat">Category</p>
            <p className="p-points">Points needed</p>
          </div>
          <div className="form-badge-content">
            <form onSubmit={handleSubmitPut}>
              <label htmlFor="name" />
              <input
                type="text"
                name="name"
                placeholder={badges[visable.element].name}
                autoComplete="off"
              />
              <input
                type="text"
                name="description"
                placeholder={badges[visable.element].description}
              />
              <input
                type="text"
                name="level"
                placeholder={badges[visable.element].level}
              />
              <input
                type="text"
                name="category"
                placeholder={badges[visable.element].category}
              />
              <input
                type="text"
                name="points"
                placeholder={badges[visable.element].points_needed}
              />
              <button className="button-edit" type="reset">
                Undo
              </button>
              <button className="button-submit" type="submit">
                SAVE
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-badge-page">
      <div className="table-badges">
        <div className="badges-head">
          <div className="badge-name">Logo + Name</div>
          <div className="badge-desc">Description</div>
          <div className="badge-level">Level</div>
          <div className="badge-cat">Category</div>
          <div className="badge-points">Points</div>
          <div className="badge-edit">Edit</div>
          <div className="badge-delete">Delete</div>
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
              <div className="badge-level-content">{item.level}</div>
              <div className="badge-cat-content">{item.category}</div>
              <div className="badge-points-content">{item.points_needed}</div>
              <div className="badge-edit-content">
                <button
                  className="button-edit"
                  onClick={() => handleClick(index)}
                >
                  EDIT
                </button>
              </div>
              <div className="badge-delete-content">
                <button
                  className="button-delete"
                  onClick={() => deleteBadge(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="change-box-badge">
              {visable.element === index && visable.bool ? <Edit /> : ""}
            </div>
          </div>
        ))}
      </div>
      <div className="add-badge-area">
        <h2>Add badge</h2>
        <form onSubmit={handleSubmitPost}>
          <input
            ref={inputRef}
            type="file"
            name="file"
            id="file"
            required="required"
            onChange={handlePicture}
            accept="image/*"
          />
          {source && <img width="100px" height="100px" controls src={source} />}
          {source ? (
            <label for="file">Velg et annet bilde</label>
          ) : (
            <label for="file">Velg bilde</label>
          )}

          <button type="submit">Legg til</button>
        </form>
      </div>
    </div>
  );
}
