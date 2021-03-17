/*

check 
https://github.com/daenub/IAD2019.news/blob/master/components/header/index.js

*/

import React, { useContext } from "react";
import "./styles.css";
import {
  Context as SessionContext,
  Action as SessionAction,
} from "../../context/session";
import Button from "../Button";
import StatusIcon, { StatusIconIcon } from "../Status";

function CapterMenu() {
  const { state, dispatch } = useContext(SessionContext);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    dispatch({
      type: SessionAction.SET_CHAPTER,
      payload: {
        id,
      },
    });
  };

  return (
    <div className="capter-menu">
      <div className="capter-menu__list">
        {state.chapters.map((item) => (
          <div
            className={`capter-menu__item ${
              state.current.chapter === item.id
                ? "capter-menu__item--active"
                : "capter-menu__item--inactive"
            } ${
              state.done.includes(item.id) && state.current.chapter !== item.id
                ? "capter-menu__item--done"
                : "capter-menu__item--open"
            }`}
            key={item.id}
          >
            <Button onClick={(e) => handleClick(e, item.id)}>
              {(state.done.includes(item.id) && state.current.chapter !== item.id && (
                <StatusIcon icon={StatusIconIcon.ok} />
              )) ||
                (state.current.chapter !== item.id && (
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

export default CapterMenu;
