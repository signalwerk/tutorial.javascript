import React, { useContext } from "react";
import "./styles.css";
import Window from "../Window";
import WorkSpace from "../WorkSpace";

type PlayerProps = {
  text: string;
  filename: string;
};

function Player({ text, filename }: PlayerProps) {
  return (
    <div className="player">
      <div className="player__code">
        <WorkSpace preview={text}>
          <Window filename={filename}>
            <div className="player__editor">
              <div className="player__text">
                <pre>
                  <code>{text}</code>
                </pre>
              </div>
            </div>
          </Window>
        </WorkSpace>
      </div>
      <div className="player__video code"></div>
    </div>
  );
}

export default Player;
