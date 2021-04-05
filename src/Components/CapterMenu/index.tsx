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

import { Context as CourseContext } from "../../context/course";

import { Chapter } from "../../context/course";
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
  const { state } = useContext(SessionContext);
  const { state: appState } = useContext(CourseContext);
  let { chapter } = useParams<RouterParams>();

  return (
    <div className="capter-menu">
      {
        <div className="capter-menu__list">
          {appState.chapters &&
            appState.chapters.map((item: Chapter) => (
              <CapterMenuItem
                key={item.id}
                done={(state.progress && state.progress[chapter]?.done) || false}
                active={chapter === item.id}
              >
                <Link to={`/course/js/basic/${item.id}/overview`}>
                  {state.progress && state.progress[item.id]?.done && (
                    <StatusIcon />
                  )}
                  {item.title}
                </Link>
              </CapterMenuItem>
            ))}
        </div>
      }
    </div>
  );
}

export default CapterMenu;
