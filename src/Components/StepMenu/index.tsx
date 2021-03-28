import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import "./styles.css";
import { RouterParams } from "../../index";
import {
  Context as SessionContext,
  Action as SessionAction,
  Step,
} from "../../context/session";
import Button from "../Button";
import StatusIcon from "../StatusIcon";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

type StepMenuProps = {
  steps: Step[];
};

type StepMenuItemProps = {
  children: React.ReactNode;
  done: boolean;
  active: boolean;
};

function StepMenuItem({ children, done, active }: StepMenuItemProps) {
  return (
    <div
      className={`step-menu__item ${
        active ? "step-menu__item--active" : "step-menu__item--inactive"
      } ${done && !active ? "step-menu__item--done" : "step-menu__item--open"}`}
    >
      {children}
    </div>
  );
}

function StepMenu({ steps }: StepMenuProps) {
  const { state, dispatch } = useContext(SessionContext);
  let { step, chapter } = useParams<RouterParams>();

  // const chapter = state.chapters.find(
  //   (item) => item.id === state.current.chapter
  // );

  return (
    <div className="step-menu">
      <div className="step-menu__list">
        {steps.map((item) => (
          <StepMenuItem
            key={item.id}
            done={state.done.step.includes(item.id)}
            active={step === item.id}
          >
            <Link
              className="step-menu__link"
              to={`/course/js/basic/${chapter}/${item.id}`}
            >
              {state.done.step.includes(item.id) && <StatusIcon />}
              {item.title}
            </Link>
          </StepMenuItem>
        ))}
      </div>
    </div>
  );
}

export default StepMenu;
