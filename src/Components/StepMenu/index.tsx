import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import "./styles.css";
import { RouterParams } from "../../index";
import { Context as SessionContext } from "../../context/session";
import { Step } from "../../context/course";

import { ROUTE } from "../../util/api";
import StatusIcon from "../StatusIcon";
import { Link } from "react-router-dom";

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
  const { state } = useContext(SessionContext);
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
            done={
              (state.progress &&
                state.progress[chapter]?.steps[item.id] &&
                state.progress[chapter]?.steps[item.id].done) ||
              false
            }
            active={step === item.id}
          >
            <Link
              className="step-menu__link"
              to={ROUTE.step({ chapter, step: item.id })}
            >
              {state.progress &&
                state.progress[chapter]?.steps[item.id] &&
                state.progress[chapter]?.steps[item.id].done && <StatusIcon />}
              {item.title}
            </Link>
          </StepMenuItem>
        ))}
      </div>
    </div>
  );
}

export default StepMenu;
