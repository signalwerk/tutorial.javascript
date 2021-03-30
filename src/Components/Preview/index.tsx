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
    runCodeWithDateFunction(`function(Box, print){ ${code} }`);
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

          <text className="svg__text code" textAnchor="end" x="205" y="18">
            A4
          </text>

          {boxes.map((item, index) => (
            <rect
              key={index}
              className="svg__rect"
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
            />
          ))}
        </svg>
        {/* 
        <pre>
          <code>{JSON.stringify(boxes, null, 2)}</code>
        </pre>
         */}
      </div>

      {texts.length > 0 && (
        <div className="preview__console code">
          <pre>
            {texts.map((text, index) => (
              <code key={index}>
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
          <div className="preview__debug">
            <code>{error}</code>
          </div>
        </div>
      )}
    </div>
  );
}

export default Preview;
