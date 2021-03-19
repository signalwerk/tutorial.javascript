import React, { useContext, useRef, useState, useEffect } from "react";
import { useVideojs } from "./useVideojs";
import {
  Context as SessionContext,
  Action as SessionAction,
  Selection,
} from "../../context/session";
import "./styles.css";

import "video.js/dist/video-js.css";

function VideoPlayer() {
  const { state, dispatch } = useContext(SessionContext);

  const dispatchPos = (pos: number | undefined) => {
    dispatch({
      type: SessionAction.SET_PLAYER_POSITION,
      payload: {
        value: pos || 0,
      },
    });
  };

  const onPlay = (currentTime?: number) => {
    dispatchPos(currentTime);
    console.log("Video played at: ", currentTime);
  };

  const onPause = (currentTime?: number) => {
    dispatchPos(currentTime);
    console.log("Video paused at: ", currentTime);
  };

  const onEnd = (currentTime?: number) => {
    dispatchPos(currentTime);
    console.log(`Video ended at ${currentTime}`);
  };

  const onTimeUpdate = (currentTime: number) => {
    dispatchPos(currentTime);
    console.log(`Video current time is ${currentTime}`);
  };

  const { vjsId, vjsRef, vjsClassName } = useVideojs({
    src: "./function.call.mp4",
    controls: true,
    autoplay: false,
    responsive: false,
    bigPlayButtonCentered: true,
    width: 200,
    height: 200,
    onPlay,
    onPause,
    onEnd,
    onTimeUpdate,
  });

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  return (
    <div className="video-player">
      <div data-vjs-player>
        <video ref={vjsRef} id={vjsId} className={vjsClassName}></video>
      </div>
    </div>
  );
}

export default VideoPlayer;
