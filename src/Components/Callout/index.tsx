import React, { ReactNode } from "react";
import "./styles.css";

type CalloutProps = {
  children: ReactNode;
};

function Callout({ children }: CalloutProps) {
  return <div className="callout">{children}</div>;
}

export default Callout;
