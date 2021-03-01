import React from "react";
import "./styles.css";

type ButtonProps = {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const Button = ({ children, onClick }: ButtonProps) => (
  <button className="button" onClick={onClick}>
    {children}
  </button>
);

export default Button;
