import axios from "axios";
import React from "react";

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
    axios.post("/api/postvideo", postData);
  };

  return (
    <div className="VideoInput">
      <input
        ref={inputRef}
        className="VideoInput_input"
        type="file"
        onChange={handleFileChange}
        accept=".mov,.mp4"
      />
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
  );
}
