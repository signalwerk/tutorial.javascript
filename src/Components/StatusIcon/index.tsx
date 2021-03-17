import React, { useContext } from "react";
import "./styles.css";

export enum StatusIconIcon {
  ok = "ok",
  play = "play",
}

type StatusIconProps = {
  icon: StatusIconIcon;
};

function StatusIcon({ icon }: StatusIconProps) {
  return (
    <span className={`status-icon status-icon--${icon}`}>
      <span className={`icon icon-${icon}`} />
    </span>
  );
}

export default StatusIcon;
