import React, { useContext, useState, useEffect } from "react";
import "./styles.css";

type PreviewProps = {
  code: string;
  // filename: string;
  hideErrors?: boolean;
  themeNetative?: boolean;
};

type Box = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
};

type Text = string;

let boxList: Box[] = [];
let textList: Text[] = [];
let renderError = "";

function Preview({ code, hideErrors, themeNetative }: PreviewProps) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [texts, setTexts] = useState<Text[]>([]);
  const [error, setError] = useState("");

  function Box(x = 0, y = 0, width = 100, height = 100) {
    boxList = [
      ...boxList,
      {
        x: x,
        y: y,
        width,
        height,
      },
    ];
  }

  function print(text = "") {
    // const { x, y, width, height } = props || {};
    // console.log("run box", { x, y, width, height });
    textList = [...textList, text];
  }

  const render = (code: string) => {
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
    boxList = [];
    textList = [];
    renderError = "";
    render(code);
    setBoxes(boxList);
    setTexts(textList);
    setError(renderError);
  }, [code]);

  return (
    <div className={themeNetative ? "preview preview--negative" : "preview"}>
      <div className="preview__view">
        <svg
          width="215"
          height="302"
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
        <div className="preview__console code">
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

      {error && !hideErrors && (
        <div className="preview__error">
          <p>⚠️ Der Code hat im Moment noch Fehler.</p>
          <pre className="preview__debug">
            <code>{error}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

export default Preview;
