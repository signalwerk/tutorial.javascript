import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

type CalloutProps = {
  children: ReactNode;
  done: boolean;
  next: string;
};

function Callout({ children, done, next }: CalloutProps) {
  return (
    <div className={`callout callout--${done ? "done" : "open"}`}>
      {children}

      {done === true && (
        <Link to={next}>
          <div className="callout__next">
            <div className="callout__next-icon icon icon-right"></div>
            <h3 className="callout__next-text">Nächste Aufgabe</h3>
          </div>
        </Link>
      )}
    </div>
  );
}

export default Callout;
