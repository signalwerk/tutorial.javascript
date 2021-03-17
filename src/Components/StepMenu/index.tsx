import React, { useContext } from "react";
import "./styles.css";
import {
  Context as SessionContext,
  Action as SessionAction,
} from "../../context/session";
import Button from "../Button";
import StatusIcon, { StatusIconIcon } from "../StatusIcon";

function StepMenu() {
  const { state, dispatch } = useContext(SessionContext);

  const chapter = state.chapters.find(
    (item) => item.id === state.current.chapter
  );

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    dispatch({
      type: SessionAction.SET_STEP,
      payload: {
        id,
      },
    });
  };

  return (
    <div className="step-menu">
      <div className="step-menu__list">
        {chapter?.steps?.map((item) => (
          <div
            className={`step-menu__item ${
              state.current.step === item.id
                ? "step-menu__item--active"
                : "step-menu__item--inactive"
            } ${
              state.done.includes(item.id) && state.current.step !== item.id
                ? "step-menu__item--done"
                : "step-menu__item--open"
            }`}
            key={item.id}
          >
            <Button onClick={(e) => handleClick(e, item.id)}>
              {(state.done.includes(item.id) &&
                state.current.step !== item.id && (
                  <StatusIcon icon={StatusIconIcon.ok} />
                )) ||
                (state.current.step !== item.id && (
                  <StatusIcon icon={StatusIconIcon.play} />
                ))}
              {item.title}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepMenu;
