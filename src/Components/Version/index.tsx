import React, { useContext } from "react";
import "./styles.css";

// const options = {
//   year: "numeric",
//   month: "long",
//   day: "numeric",
// };

// const options = {

//   year: 'numeric',
//   month: 'numeric',
//   day: 'numeric',
//   hour: '2-digit',
//   minute: '2-digit',
// }

const version = new Intl.DateTimeFormat("de-DE", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})
  .format(new Date(parseInt(process.env.REACT_APP_BUILD_TIME, 10) * 1000))
  .replace(",", "");

function Version() {
  return <div className="version">Version {version}</div>;
}

export default Version;
