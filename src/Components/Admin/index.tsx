import React, { useContext, useState, useEffect } from "react";
import "./styles.css";
import {
  Context as SessionContext,
  Action as SessionAction,
} from "../../context/session";
import Button from "../Button";
import StatusIcon, { StatusIconIcon } from "../StatusIcon";

// function createGist(opts) {
//   ChromeSamples.log('Posting request to GitHub API...');

// }

let start = 0;
let record = [];

function Admin() {
  const { state, dispatch } = useContext(SessionContext);

  const [recording, setRecording] = useState<boolean>(false);

  useEffect(() => {
    const text = state.current.editor.content;
    const now = Date.now();

    record.push({
      time: now - start,
      text,
    });
  }, [state.current.editor.content]);

  const handleStop = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("post");
    setRecording(false);

    // dispatch({
    //   type: SessionAction.SET_CHAPTER,
    //   payload: {
    //     id,
    //   },
    // });

    fetch("http://localhost:3005", {
      method: "post",
      body: JSON.stringify({
        id: "function.call",
        content: JSON.stringify(record, null, 2),
      }),
    })
      .then((response) => {
        console.log("done");
        // return response.json();
      })
      .then((e) => {
        console.log("error", e);
        // return response.json();
      });
  };

  const handleRec = (event: React.MouseEvent<HTMLButtonElement>) => {
    setRecording(true);
    start = Date.now();
    record = [];

    record.push({
      time: 0,
      text: state.current.editor.content,
    });
  };

  return (
    <div className="admin">
      {(!recording && (
        <Button onClick={(e) => handleRec(e)}>Record</Button>
      )) || <Button onClick={(e) => handleStop(e)}>Stop</Button>}
    </div>
  );
}

export default Admin;
