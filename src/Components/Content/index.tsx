import React, { ReactNode } from "react";
import "./styles.css";

type ContentProps = {
  children: ReactNode;
  className?: string;
};

function Content({ children, className = "" }: ContentProps) {
  return <div className={`content ${className}`}>{children}</div>;
}

export default Content;
