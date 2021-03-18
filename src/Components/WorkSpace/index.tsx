import React, { useContext, useState, useEffect } from "react";
import "./styles.css";
import Window from "../Window";

type WorkSpaceProps = {
  preview: string;
  // filename: string;
  children: React.ReactNode;
};

type Box = {
  x?: Number;
  y?: Number;
  width?: Number;
  height?: Number;
};

// const boxes: Box[] = [
//   {
//     x: 50,
//     y: 20,
//     width: 20,
//     height: 20,
//   },
//   {
//     x: 0,
//     y: 148.5,
//     width: 210,
//     height: 148.5,
//   },
// ];

let boxList = [];
let textList = [];
let renderError = "";

function WorkSpace({ children, preview }: WorkSpaceProps) {
  const [boxes, setBoxes] = useState([]);
  const [texts, setTexts] = useState([]);
  const [code, setCode] = useState(preview);
  const [error, setError] = useState("");

  function Box(x = 0, y = 0) {
    // const { x, y, width, height } = props || {};
    // console.log("run box", { x, y, width, height });
    boxList = [
      ...boxList,
      {
        x: x,
        y: y,
        width: 110,
        height: 110,
      },
    ];
  }

  function print(text = "") {
    // const { x, y, width, height } = props || {};
    // console.log("run box", { x, y, width, height });
    textList = [...textList, text];
  }

  const render = (code) => {
    function runCodeWithDateFunction(code: string) {
      // return Function('"use strict";return (' + code + ")")()(Box);

      try {
        return Function("return (" + code + ")")()(Box, print);
      } catch (e) {
        renderError = e.name + ": " + e.message;
        console.warn(renderError);
      }
    }
    console.log("code", code);
    console.log(runCodeWithDateFunction(`function(Box, print){ ${code} }`));
  };

  useEffect(() => {
    setCode(preview);
    boxList = [];
    textList = [];
    renderError = "";
    render(preview);
    setBoxes(boxList);
    setTexts(textList);
    setError(renderError);
  }, [preview]);

  return (
    <div className="work-space">
      <div className="work-space__file">{children}</div>
      <div className="work-space__canvas">
        <Window filename="Vorschau">
          <div className="work-space__view">
            <svg
              width="210"
              height="297"
              viewBox="-2.5 -2.5 215 302"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect className="svg__rect svg__paper" width="210" height="297" />

              <text className="svg__text code" text-anchor="end" x="205" y="18">
                A4
              </text>

              {/* <text className="svg__text code" text-anchor="start" x="60" y="40">
                  <tspan x="0" dy="1.2em">
                    very long text
                  </tspan>
                  <tspan x="0" dy="1.2em">
                    I would like to linebreak
                  </tspan>
                </text> */}

              {boxes.map((item) => (
                <rect
                  className="svg__rect"
                  x={item.x}
                  y={item.y}
                  width={item.width}
                  height={item.height}
                />
              ))}
            </svg>

            {/* <pre>
              <code>{JSON.stringify(boxes, null, 2)}</code>
            </pre> */}
          </div>

          {texts.length > 0 && (
            <div className="work-space__console code">
              <pre>
                {texts.map((text) => (
                  <code>
                    {text}
                    {"\n"}
                  </code>
                ))}
              </pre>
            </div>
          )}

          {error && (
            <div className="work-space__error">
              <p>⚠️ Der Code hat im Moment noch Fehler.</p>
              <pre className="work-space__debug">
                <code>{error}</code>
              </pre>
            </div>
          )}
        </Window>
      </div>
    </div>
  );
}

export default WorkSpace;
