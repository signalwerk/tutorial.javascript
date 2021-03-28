import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Markdown from "../Markdown";

import Content from "../Content";

import "./styles.css";

const Home = () => (
  <div className="home">
    <div className="home__inner">
      <h1 className="home__title">JavaScript · Einführung</h1>
      <p className="home__intro inline-link">
        <Markdown
          text={`In diesem Teil des Kurses werden die Grundlagen von JavaScript erklärt. Die in InDesign verwendete Scriptsprache «ExtendScript» basiert auf JavaScript [(ECMAScript 3)](https://de.wikipedia.org/wiki/JavaScript#Versionsgeschichte_von_ECMAScript_%28ECMA-262%29)`}
        />
      </p>
      <div className="home__cta">
        <Link className="home__btn" to="/course/js/basic/functions/call">
          <em>Kurs starten</em>
        </Link>
      </div>
    </div>
  </div>
);

export default Home;
