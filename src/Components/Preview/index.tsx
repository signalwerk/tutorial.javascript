import React, { useState, useEffect } from "react";
import "./styles.css";

type PreviewProps = {
  code: string;
  check?: string;
  hideErrors?: boolean;
  themeNetative?: boolean;
  solved?: Function;
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

function Preview({
  code,
  check,
  hideErrors,
  themeNetative,
  solved,
}: PreviewProps) {
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

  const conzole = {
    log: (text = "") => {
      textList = [...textList, text];
    },
  };

  function hasBox(x?: number, y?: number, width?: number, height?: number) {
    return boxList.filter((item) => {
      let found = true;

      if (x) {
        found = item.x === x;
      }
      if (y) {
        found = item.y === y;
      }

      if (width) {
        found = item.width === width;
      }

      if (height) {
        found = item.height === height;
      }

      return found;
    }).length;
  }

  function hasText(filter: (value: Text, index: number, array: Text[]) => any) {
    return textList.filter(filter).length;
  }

  function complete(status: boolean) {
    if (solved) {
      solved(status);
    }
  }

  const render = (code: string, check: string | undefined) => {
    if (!code) {
      return;
    }
    function runCodeWithDateFunction(code: string) {
      // return Function('"use strict";return (' + code + ")")()(Box);

      try {
        return Function("return (\n" + code + "\n)")()(
          Box,
          print,
          hasBox,
          hasText,
          complete,
          conzole
        );
      } catch (e) {
        complete(false);
        renderError = e.name + ": " + e.message;
        // console.warn(renderError);
      }
    }

    runCodeWithDateFunction(
      `function(Box, print, hasBox, hasText, complete, console){ \n${code}\n${
        check ? check : ""
      }\n }`
    );
  };

  useEffect(() => {
    boxList = [];
    textList = [];
    renderError = "";
    render(code, check);
    setBoxes(boxList);
    setTexts(textList);
    setError(renderError);
  }, [code, check]);

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
                {JSON.stringify(text)}
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
