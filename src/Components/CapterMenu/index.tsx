import React, { useContext } from "react";
import "./styles.css";
import {
  Context as SessionContext,
  Action as SessionAction,
} from "../../context/session";
import Button from "../Button";

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
      menu
      <div className="capter-menu__list">
        {state.chapters.map((item) => (
          <div className="capter-menu__item" key={item.id}>
            <Button onClick={(e) => handleClick(e, item.id)}>
              {item.title}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CapterMenu;
