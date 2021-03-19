// https://areknawo.com/js-tidbits-mediastream-api/

// @ts-nocheck

import React, { useContext, useState, useEffect } from "react";

import { saveAs } from "file-saver";

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
      <button type="button" onClick={handleStore}>
        download
      </button>
      <video
        src={URL.createObjectURL(srcBlob)}
        width={520}
        height={480}
        controls
      />
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

  return <video ref={videoPreviewRef} width={520} height={480} autoPlay />;
}

/*
async function getConstraints() {
  const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
  const video = {};

  if (supportedConstraints.width) {
    video.width = 1920;
  }
  if (supportedConstraints.height) {
    video.height = 1080;
  }
  if (supportedConstraints.deviceId) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const device = devices.find(device => {
      return device.kind == "videoinput";
    });
    video.deviceId = device.deviceId;
  }

  return { video, audio: true };
}

async function getMedia() {
  const constraints = await getConstraints();
  const video = document.querySelector("video");
  const audio = document.querySelector("audio");
  let stream = null;

  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(stream, video.srcObject)
    video.srcObject = stream;
    audio.srcObject = stream;
    // use the stream
  } catch (err) {
    // handle the error - user's rejection or no media available
  }
}
getMedia();
*/

function ScreenRecorderApp() {
  let {
    error,
    status,
    mediaBlob,
    stopRecording,
    getMediaStream,
    startRecording,
    liveStream,
  } = useMediaRecorder({
    // recordScreen: true,
    blobOptions: { type: "video/webm" },
    mediaStreamConstraints: {
      audio: true,
      // video: true,
      video: { width: 1920, height: 1080 },
    },
  });

  return (
    <article>
      <h1>Screen recorder</h1>
      {error ? `${status} ${error.message}` : status}
      <section>
        <button
          type="button"
          onClick={getMediaStream}
          disabled={status === "ready"}
        >
          Start
        </button>
        <button
          type="button"
          onClick={startRecording}
          disabled={status === "recording"}
        >
          Record
        </button>
        <button
          type="button"
          onClick={stopRecording}
          disabled={status !== "recording"}
        >
          Stop
        </button>
      </section>
      <LiveStreamPreview stream={liveStream} />
      <Player srcBlob={mediaBlob} />
    </article>
  );
}

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
      <ScreenRecorderApp />
      {(!recording && (
        <Button onClick={(e) => handleRec(e)}>Record</Button>
      )) || <Button onClick={(e) => handleStop(e)}>Stop</Button>}
    </div>
  );
}

export default Admin;
