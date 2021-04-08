import React, { useContext } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Markdown from "../Markdown";

import Content from "../Content";
import { Context as CourseContext } from "../../context/course";

import "./styles.css";

const Home = () => {
  const {
    state: { lang },
  } = useContext(CourseContext);

  return (
    <div className="home">
      <div className="home__inner">
        <h1 className="home__title">{lang["intro.title"]}</h1>
        <p className="home__intro inline-link">
          <Markdown text={lang["intro.text"]} />
        </p>
        <div className="home__cta">
          <Link className="home__btn" to={lang["intro.link"]}>
            <em>{lang["intro.btn"]}</em>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
