import React, { Children, useContext } from "react";
import "./styles.css";

type WindowProps = {
  children: React.ReactNode;
  filename: string;
};

function Window({ children, filename }: WindowProps) {
  return (
    <div className="window">
      <div className="window__inner">
        <div className="window__filename">{filename}</div>
        <div className="window__content">{children}</div>
      </div>
    </div>
  );
}

export default Window;
