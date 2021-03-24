import React, { useContext, useState, useEffect } from "react";
import "./styles.css";
import Window from "../Window";
import Preview from "../Preview";

type WorkSpaceProps = {
  preview: string;
  // filename: string;
  children: React.ReactNode;
  hideErrors?: boolean;
};

function WorkSpace({ children, preview, hideErrors }: WorkSpaceProps) {
  return (
    <div className="work-space">
      <div className="work-space__file">{children}</div>
      <div className="work-space__canvas">
        <Window filename="Vorschau">
          <Preview code={preview} hideErrors={hideErrors} />
        </Window>
      </div>
    </div>
  );
}

export default WorkSpace;
