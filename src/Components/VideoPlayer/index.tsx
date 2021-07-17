import React, { useEffect, useRef, useState } from "react";
import videojs, { VideoJsPlayer } from "video.js";
import "video.js/dist/video-js.css";
// import LineControl from "../LineControl";
import Track from "../Track";
import "./styles.css";
import { useVideojs } from "./useVideojs";

type VideoPlayerProps = {
  onTimeUpdate: Function;
  src: string;
};

function VideoPlayer({ onTimeUpdate: update, src }: VideoPlayerProps) {
  const [isPlaying, setPlaying] = useState(false);
  const [isMuted, setMute] = useState(false);
  const [duration, setDuration] = useState(0);
  const [durationFormat, setDurationFormat] = useState("");
  const [playPosition, setPlayPosition] = useState(0);
  const [isInitial, setInitial] = useState(true);

  let player = useRef<VideoJsPlayer | null>(null);

  const updatePosition = (pos: number | undefined) => {
    update(pos || 0);
    setPlayPosition(pos || 0);
    // dispatch({
    //   type: SessionAction.SET_PLAYER_POSITION,
    //   payload: {
    //     value: pos || 0,
    //   },
    // });
  };

  useEffect(() => {
    updatePosition(0);
    setDuration(0);
    setMute(false);
    setPlaying(false);
    setInitial(true);
  }, [src]);

  const onPlay = (currentTime?: number) => {
    updatePosition(currentTime);
  };

  const onPause = (currentTime?: number) => {
    updatePosition(currentTime);
  };

  const onEnd = (currentTime?: number) => {
    setPlaying(false);
    updatePosition(currentTime);
  };

  const onTimeUpdate = (currentTime: number) => {
    setPlayPosition(currentTime);
    updatePosition(currentTime);
  };
  const onLoadedmetadata = (totalTime: number) => {
    // updatePosition(currentTime);
    setDuration(totalTime);
  };

  const onReady = (p: VideoJsPlayer) => {
    player.current = p;
  };

  const { videoNodeRef } = useVideojs({
    src,
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

  const startPlayback = () => {
    if (player.current) {
      setInitial(false);
      togglePlayback();
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
            {!!duration && (
              <Track
                max={duration}
                value={playPosition}
                onChange={(t: number) => setPosition(t)}
              />
            )}
          </div>
          <div className="video-player__control">
            {!!duration && (
              <>
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
              </>
            )}
            <div className="video-player__time">
              {playPositionFormat} | {durationFormat}
            </div>
          </div>
        </div>
        {!!duration && isInitial && (
          <div className="video-player__big-start">
            <button onClick={startPlayback}>
              <span className="icon-play"></span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default VideoPlayer;
