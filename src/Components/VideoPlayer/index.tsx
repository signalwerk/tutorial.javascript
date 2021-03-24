import React, { useContext, useRef, useState, useEffect } from "react";
import videojs, { VideoJsPlayer } from "video.js";
// import LineControl from "../LineControl";
import Track from "../Track";

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

  const [isPlaying, setPlaying] = useState(false);
  const [isMuted, setMute] = useState(false);
  const [duration, setDuration] = useState(0);
  const [durationFormat, setDurationFormat] = useState("");
  const [playPosition, setPlayPosition] = useState(0);

  let player = useRef<VideoJsPlayer | null>(null);

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
    setPlaying(false);
    dispatchPos(currentTime);
    console.log(`Video ended at ${currentTime}`);
  };

  const onTimeUpdate = (currentTime: number) => {
    setPlayPosition(currentTime);
    dispatchPos(currentTime);
    console.log(`Video current time is ${currentTime}`);
  };
  const onLoadedmetadata = (totalTime: number) => {
    // dispatchPos(currentTime);
    setDuration(totalTime);
    console.log(`⚠️⚠️⚠️ totalTime: ${totalTime}`);
  };

  const onReady = (p: VideoJsPlayer) => {
    player.current = p;
  };

  const { videoNodeRef } = useVideojs({
    src: "./function.call.mp4",
    controls: false,
    autoplay: false,
    responsive: false,
    bigPlayButtonCentered: false,
    width: 200,
    height: 200,
    html5: {
      hls: {
        overrideNative: true,
      },
      nativeAudioTracks: false,
      nativeVideoTracks: false,
    },
    onPlay,
    onPause,
    onEnd,
    onReady,
    onTimeUpdate,
    onLoadedmetadata,
  });

  const togglePlayback = () => {
    // this.player.muted(this.mute);

    if (player.current) {
      setPlaying(!isPlaying);

      if (!isPlaying) {
        player.current.play();
      } else {
        player.current.pause();
      }
    }
  };

  const toggleMute = () => {
    // this.player.muted(this.mute);

    if (player.current) {
      setMute(!isMuted);

      if (!isMuted) {
        player.current.muted(true);
      } else {
        player.current.muted(false);
      }
    }
  };

  const setPosition = (timestamp: number) => {
    // this.player.muted(this.mute);

    if (player.current) {
      player.current.currentTime(timestamp);
    }
  };

  const playPositionFormat = videojs.formatTime(
    Math.min(playPosition, duration),
    600
  );

  useEffect(() => {
    setDurationFormat(videojs.formatTime(duration, 600));
  }, [duration]);

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  return (
    <>
      <div className="video-player">
        <div className="video-player__video">
          <div data-vjs-player>
            <video ref={videoNodeRef}></video>
          </div>
        </div>
        <div className="video-player__bar">
          <div className="video-player__track">
            {duration && (
              <Track
                max={duration}
                value={playPosition}
                onChange={(t: number) => setPosition(t)}
              />
            )}
          </div>
          <div className="video-player__control">
            <button
              className={`video-player__btn ${
                isPlaying ? "icon-pause" : "icon-play"
              }`}
              onClick={togglePlayback}
            ></button>
            <button
              className={`video-player__btn ${
                isMuted ? "icon-volume-off" : "icon-volume-up"
              }`}
              onClick={toggleMute}
            ></button>
            <div className="video-player__time">
              {playPositionFormat} | {durationFormat}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoPlayer;
