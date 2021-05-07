// https://areknawo.com/js-tidbits-mediastream-api/

// @ts-nocheck

import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";

import "./styles.css";
import {
  Context as SessionContext,
  Action as SessionAction,
} from "../../context/session";
import Button from "../Button";
import StatusIcon from "../StatusIcon";

// function createGist(opts) {
//   ChromeSamples.log('Posting request to GitHub API...');

// }

// import React from "react";
import useMediaRecorder from "@wmik/use-media-recorder";

function Player({ srcBlob, audio }) {
  if (!srcBlob) {
    return null;
  }

  if (audio) {
    return <audio src={URL.createObjectURL(srcBlob)} controls />;
  }

  const handleStore = (event: React.MouseEvent<HTMLButtonElement>) => {
    saveAs(srcBlob, "film.webm");
  };

  return (
    <div>
      <div>
        <video
          src={URL.createObjectURL(srcBlob)}
          width={520}
          height={293}
          controls
        />
        <div>
          <Button onClick={handleStore}>download</Button>
        </div>
      </div>
    </div>
  );
}

function LiveStreamPreview({ stream }) {
  let videoPreviewRef = React.useRef();

  React.useEffect(() => {
    if (videoPreviewRef.current && stream) {
      videoPreviewRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) {
    return null;
  }

  return <video ref={videoPreviewRef} width={520} height={293} autoPlay />;
}

let start = 0;
let record = [];

function Admin() {
  const { state, dispatch } = useContext(SessionContext);

  const [recording, setRecording] = useState<boolean>(false);
  const [preview, setPreview] = useState<boolean>(false);
  let { chapter, step } = useParams<RouterParams>();

  let {
    error,
    status,
    mediaBlob,
    stopRecording,
    getMediaStream,
    clearMediaStream,
    startRecording,
    liveStream,
  } = useMediaRecorder({
    // recordScreen: true,
    blobOptions: {
      // type: "video/webm",
      type: "video/webm;codecs=h264",

      // both for audio and video tracks
      // bitsPerSecond: 128000,

      // only for audio track
      audioBitsPerSecond: 320000,

      // only for video track
      videoBitsPerSecond: 8000000,
    },
    mediaStreamConstraints: {
      audio: true,
      // video: true,
      video: { width: 1920, height: 1080 },
    },
  });

  useEffect(() => {
    const text = state.current.editor.content;
    const now = Date.now();

    record.push({
      time: now - start,

      editor: {
        content: state.current.editor.content,
        selection: {
          start: state.current.editor.selection.start,
          end: state.current.editor.selection.end,
        },
      },
    });
  }, [
    state.current.editor.content,
    state.current.editor.selection.start,
    state.current.editor.selection.end,
  ]);

  const handleStop = (event: React.MouseEvent<HTMLButtonElement>) => {
    stopRecording();
    setRecording(false);

    fetch("http://localhost:3005", {
      method: "post",
      body: JSON.stringify({
        chapter,
        step,
        content: JSON.stringify(record, null, 2),
      }),
    })
      .then((response) => {
        console.log("done text");
        // return response.json();
      })
      .then((e) => {
        console.log("error text", e);
        // return response.json();
      });

    record = [];
  };

  // if (status === "stopped") {
  //   fetch(`http://localhost:3005/media/${chapter}/${step}`, {
  //     method: "post",
  //     body: mediaBlob,
  //   })
  //     .then((response) => {
  //       console.log("done video");
  //       // return response.json();
  //     })
  //     .then((e) => {
  //       console.log("error video", e);
  //       // return response.json();
  //     });
  // }

  useEffect(() => {
    if (status === "stopped") {
      var reader = new FileReader();
      reader.readAsDataURL(mediaBlob);
      reader.onloadend = function () {
        var base64dataURI = reader.result.toString();
        let base64data = base64dataURI.substr(base64dataURI.indexOf(",") + 1);
        // console.log(base64data);

        fetch(`http://localhost:3005/media/${chapter}/${step}`, {
          method: "post",
          // body: mediaBlob,
          body: base64data,
        })
          .then((response) => {
            console.log("done video");
            // return response.json();
          })
          .then((e) => {
            console.log("error video", e);
            // return response.json();
          });
      };
    }
  }, [status]);

  const handleRec = (event: React.MouseEvent<HTMLButtonElement>) => {
    startRecording();
    setRecording(true);
    start = Date.now();
    record = [];

    record.push({
      time: 0,

      editor: {
        content: state.current.editor.content,
        selection: {
          start: state.current.editor.selection.start,
          end: state.current.editor.selection.end,
        },
      },
    });
  };

  const handleStartPreview = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPreview(true);
    getMediaStream();
  };
  const handleStopPreview = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPreview(false);
    clearMediaStream();
  };

  return (
    <div className="admin">
      <h3>Recorder</h3>
      <p>{error ? `${status} ${error.message}` : status}</p>
      <div className="admin__preview">
        <div className="admin__preview-btn">
          {(!preview && (
            <button type="button" onClick={handleStartPreview}>
              Preview
            </button>
          )) || (
            <button type="button" onClick={handleStopPreview}>
              Stop Preview
            </button>
          )}
        </div>
        <div className="admin__preview-screen">
          <svg
            width="16"
            height="9"
            viewBox="0 0 16 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.5 0H0V9H8.5H16V0H8.5ZM8.5 0C10.9853 0 13 2.01472 13 4.5C13 6.98528 10.9853 9 8.5 9C6.01472 9 4 6.98528 4 4.5C4 2.01472 6.01472 0 8.5 0Z"
              fill="black"
              fillOpacity="0.7"
            />
          </svg>

          <LiveStreamPreview stream={liveStream} />
        </div>
      </div>
      <Player srcBlob={mediaBlob} />

      {(!recording && (
        <Button onClick={(e) => handleRec(e)}>Record</Button>
      )) || <Button onClick={(e) => handleStop(e)}>Stop</Button>}
    </div>
  );
}

export default Admin;
