import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PickTeam() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/team")
    .then(response => response.json())
    .then(data => setTeams(data.data))
  },[])

  return (
    <div>
      <div class="row">
        <div class="column">{teams[0].logo}</div>
        <div class="column">{teams[1].logo}</div>
        <div class="column">{teams[2].logo}</div>
        <div class="column">{teams[3].logo}</div>
      </div>
      <div class="row">
        <div class="column">{teams[4].logo}</div>
        <div class="column">{teams[5].logo}</div>
        <div class="column">{teams[6].logo}</div>
        <div class="column">{teams[7].logo}</div>
      </div>
      <div class="row">
        <div class="column">{teams[8].logo}</div>
        <div class="column">{teams[9].logo}</div>
        <div class="column">{teams[10].logo}</div>
        <div class="column">{teams[11].logo}</div>
      </div>
      <div class="row">
        <div class="column">{teams[12].logo}</div>
        <div class="column">{teams[13].logo}</div>
        <div class="column">{teams[14].logo}</div>
        <div class="column">{teams[15].logo}</div>
      </div>
    </div>
  );
}
