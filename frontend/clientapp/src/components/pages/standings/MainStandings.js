import React from "react";

export default function MainStandings(props) {
  return (
    <div>
      <div className="table-content">
        {props.stand.map((post, index) => (
          <div className="table-element" key={index}>
            <p className="rank-table">{post.rank}</p>
            <p
              onClick={() => props.userprofileLoad(post.name)}
              className="name-table"
            >
              {post.name}
            </p>
            <div className="img-club">
              <img
                src={require("../../../assets/teamLogos/" + post.club_logo)}
                alt="logo"
              />
              <p>{post.club}</p>
            </div>

            <p className="points-table">{post.points}</p>
          </div>
        ))}
      </div>

      <div className="step-buttons">
        {props.filter[0] >= 2 ? (
          <button
            onClick={() => {
              props.nextAndPrevPage(props.filter[0] - 10, props.filter[1] - 10);
            }}
            className="prev-btn"
          >
            Prev
          </button>
        ) : (
          ""
        )}

        <button
          disabled={props.disabled}
          onClick={() => {
            props.nextAndPrevPage(props.filter[0] + 10, props.filter[1] + 10);
          }}
          className="next-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}
