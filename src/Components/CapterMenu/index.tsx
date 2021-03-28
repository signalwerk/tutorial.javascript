/*

check 
https://github.com/daenub/IAD2019.news/blob/master/components/header/index.js

*/

import React, { useContext } from "react";
import "./styles.css";
import {
  Context as SessionContext,
  Action as SessionAction,
  Chapter,
} from "../../context/session";
import Button from "../Button";
import StatusIcon from "../StatusIcon";
import useFetch from "../../util/useFetch";
import { useParams } from "react-router-dom";
import { RouterParams } from "../../index";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";

type CapterMenuItemProps = {
  children: React.ReactNode;
  done: boolean;
  active: boolean;
};

function CapterMenuItem({ children, done, active }: CapterMenuItemProps) {
  return (
    <div
      className={`capter-menu__item ${
        active ? "capter-menu__item--active" : "capter-menu__item--inactive"
      } ${
        done && !active ? "capter-menu__item--done" : "capter-menu__item--open"
      }`}
    >
      {children}
    </div>
  );
}

function CapterMenu() {
  const { state, dispatch } = useContext(SessionContext);
  let { chapter } = useParams<RouterParams>();

  //<Chapter[]>
  const { response, loading, hasError } = useFetch<Chapter[]>(
    `/api/course/js/basic/chapters.json`
  );

  return (
    <div className="capter-menu">
      {!loading && (
        <div className="capter-menu__list">
          {!hasError &&
            response &&
            response.map((item: Chapter) => (
              <CapterMenuItem
                key={item.id}
                done={state.done.chapter.includes(item.id)}
                active={chapter === item.id}
              >
                <Link to={`/course/js/basic/${item.id}/overview`}>
                  {state.done.chapter.includes(item.id) && <StatusIcon />}
                  {item.title}
                </Link>
              </CapterMenuItem>
            ))}
        </div>
      )}
    </div>
  );
}

export default CapterMenu;
