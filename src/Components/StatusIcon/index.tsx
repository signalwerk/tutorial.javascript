import React, { useContext } from "react";
import "./styles.css";

function StatusIcon() {
  return (
    <span className={`status-icon status-icon--ok`}>
      <span className={`icon icon-ok`} />
    </span>
  );
}

export default StatusIcon;
