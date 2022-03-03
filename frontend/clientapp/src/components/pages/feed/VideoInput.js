import axios from "axios";
import React from "react";

import "./feed.css";

export default function VideoInput(props) {
  const { width, height } = props;

  const inputRef = React.useRef();

  const [source, setSource] = React.useState();

  let file = "";

  const handleFileChange = (event) => {
    file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setSource(url);
  };

  const handleChoose = (event) => {
    inputRef.current.click();
  };

  const postVideo = () => {
    const postData = {
      user_id: "1",
      video: file,
      caption: "hahahahahah kys video",
    };
    const headers = { "header-name": "value" };
    const config = { headers };

    axios
      .post('http://localhost:5000/api/video', postData, config)
      .then((response) => {
        console.log(response.status);
        console.log(response.data);
      })
      .catch((e) => console.log("something went wrong :(", e));
  };

  return (
    <div className="VideoInput">
      <div className="VideoInput_box">
        <input
          ref={inputRef}
          className="VideoInput_input"
          type="file"
          onChange={handleFileChange}
          id="file"
          accept=".mov,.mp4"
        />
        <label for="file">Choose a file</label>
      </div>
      <div className="VideoInput_buttons">
      {!source && <button onClick={handleChoose}>Choose</button>}
      {source && (
        <video
          className="VideoInput_video"
          width="100%"
          height={height}
          controls
          src={source}
        />
      )}
      <div className="VideoInput_footer">
        <button onClick={postVideo}>Upload</button>
      </div>
      </div>
    </div>
  );
}
